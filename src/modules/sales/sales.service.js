const db = require("../../config/db");
const AppError = require("../../utils/AppError");
const repo = require("./sales.repository");

exports.createSale = async (data, user_id) => {
  const { items } = data;

  if (!items || !items.length) {
    throw new AppError("Sale items required", 400);
  }

  return db.transaction(async (trx) => {

    // 1️⃣ Create invoice
    const invoice = await repo.createInvoice(trx, {
      user_id,
      total_sale_amount: 0,
      total_taxable_amount: 0,
      total_gst_amount: 0,
    });

    // 2️⃣ Declare totals ONCE
    let totalAmount = 0;
    let totalTaxable = 0;
    let totalGst = 0;

    // 3️⃣ Process each sale item
    for (const item of items) {

      const medicine = await repo.getMedicineById(
        trx,
        item.medicine_id
      );

      if (!medicine) {
        throw new AppError("Medicine not found", 404);
      }

      const gstRate = Number(medicine.gst_rate);
      let requiredQty = item.quantity;

      const batches = await repo.getAvailableBatches(
        trx,
        item.medicine_id
      );

      if (!batches.length) {
        throw new AppError("Insufficient stock", 400);
      }

      for (const batch of batches) {
        if (requiredQty <= 0) break;

        const deductQty = Math.min(batch.quantity, requiredQty);
        const newQty = batch.quantity - deductQty;

        // FEFO deduction
        await repo.updateBatchQuantity(
          trx,
          batch.batch_id,
          newQty
        );

        const unitMrp = Number(batch.mrp);

        // GST extraction (MRP inclusive)
        const basePrice = Number(
        (unitMrp / (1 + gstRate / 100)).toFixed(2)
        );

        const gstPerUnit = Number(
        (unitMrp - basePrice).toFixed(2)
        );

        const taxableAmount = Number(
        (basePrice * deductQty).toFixed(2)
        );

        const gstAmount = Number(
        (gstPerUnit * deductQty).toFixed(2)
        );

        const lineTotal = Number(
        (unitMrp * deductQty).toFixed(2)
        );
        await repo.createSaleItem(trx, {
          invoice_id: invoice.invoice_id,
          medicine_id: item.medicine_id,
          batch_id: batch.batch_id,
          quantity: deductQty,
          unit_price: unitMrp,
          gst_rate: gstRate,
          taxable_amount: taxableAmount,
          gst_amount: gstAmount,
          line_total: lineTotal,
        });

        await repo.createStockMovement(trx, {
          batch_id: batch.batch_id,
          change_qty: -deductQty,
          reason: "Sale",
          reference_id: invoice.invoice_id,
        });

        // Accumulate totals
        totalAmount = Number((totalAmount + lineTotal).toFixed(2));
        totalTaxable = Number((totalTaxable + taxableAmount).toFixed(2));
        totalGst = Number((totalGst + gstAmount).toFixed(2));

        requiredQty -= deductQty;
      }

      // 🚨 Important check
      if (requiredQty > 0) {
        throw new AppError("Insufficient stock across batches", 400);
      }
    }

    // 4️⃣ Update invoice totals
    await trx("sales_master")
      .where({ invoice_id: invoice.invoice_id })
      .update({
        total_sale_amount: totalAmount,
        total_taxable_amount: totalTaxable,
        total_gst_amount: totalGst,
      });

    return {
      invoice_id: invoice.invoice_id,
      totalAmount,
      totalTaxable,
      totalGst,
    };
  });
};