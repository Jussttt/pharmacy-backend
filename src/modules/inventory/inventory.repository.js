const db = require("../../config/db");

exports.createBatch = async (trx, data) => {
  const [batch] = await trx("stock_batches")
    .insert(data)
    .returning("*");

  return batch;
};

exports.createStockMovement = async (trx, data) => {
  return trx("stock_movements").insert(data);
};

exports.getStockByMedicine = async (medicine_id) => {
  return db("stock_batches")
    .where({ medicine_id })
    .andWhere("quantity", ">", 0)
    .orderBy("expiry_date", "asc");
};