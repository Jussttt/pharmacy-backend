const db = require("../../config/db");

exports.createSupplier = async (data) => {
  const [supplier] = await db("suppliers")
    .insert(data)
    .returning("*");

  return supplier;
};

exports.findByName = async (supplier_name) => {
  return db("suppliers")
    .where({ supplier_name, is_active: true })
    .first();
};

exports.getAllSuppliers = async () => {
  return db("suppliers")
    .where({ is_active: true })
    .orderBy("created_at", "desc");
};

exports.updateSupplier = async (supplier_id, data) => {
  const [updated] = await db("suppliers")
    .where({ supplier_id })
    .update(data)
    .returning("*");

  return updated;
};

exports.softDeleteSupplier = async (supplier_id) => {
  const [deleted] = await db("suppliers")
    .where({ supplier_id })
    .update({ is_active: false })
    .returning("*");

  return deleted;
};

exports.findById = async (supplier_id) => {
  return db("suppliers")
    .where({ supplier_id, is_active: true })
    .first();
};