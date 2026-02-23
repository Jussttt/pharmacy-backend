const db = require("../../config/db");
const AppError = require("../../utils/AppError");
const repo = require("./inventory.repository");

exports.addStockBatch = async (data) => {
  const {
    medicine_id,
    batch_number,
    mfg_date,
    expiry_date,
    quantity,
    purchase_price,
    mrp,
  } = data;

  if (!medicine_id || !batch_number || !expiry_date || !quantity) {
    throw new AppError("Missing required fields", 400);
  }

  return db.transaction(async (trx) => {
    const batch = await repo.createBatch(trx, {
      medicine_id,
      batch_number,
      mfg_date,
      expiry_date,
      quantity,
      purchase_price,
      mrp,
    });

    await repo.createStockMovement(trx, {
      batch_id: batch.batch_id,
      change_qty: quantity,
      reason: "Purchase",
    });

    return batch;
  });
};

exports.getStockByMedicine = async (medicine_id) => {
  return repo.getStockByMedicine(medicine_id);
};