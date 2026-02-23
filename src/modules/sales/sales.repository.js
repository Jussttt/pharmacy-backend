const db = require("../../config/db");

exports.createInvoice = async (trx, data) => {
  const [invoice] = await trx("sales_master")
    .insert(data)
    .returning("*");

  return invoice;
};

exports.createSaleItem = async (trx, data) => {
  return trx("sales_items").insert(data);
};

exports.getAvailableBatches = async (trx, medicine_id) => {
  return trx("stock_batches")
    .where({ medicine_id })
    .andWhere("quantity", ">", 0)
    .orderBy("expiry_date", "asc");
};

exports.updateBatchQuantity = async (trx, batch_id, newQty) => {
  return trx("stock_batches")
    .where({ batch_id })
    .update({ quantity: newQty });
};

exports.createStockMovement = async (trx, data) => {
  return trx("stock_movements").insert(data);
};

exports.getMedicineById = async (trx, medicine_id) => {
  return trx("medicines")
    .where({ medicine_id })
    .first();
};