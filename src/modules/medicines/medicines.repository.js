const db = require("../../config/db");

exports.createMedicine = async (data) => {
  const [medicine] = await db("medicines")
    .insert(data)
    .returning("*");

  return medicine;
};

exports.findByName = async (name) => {
  return db("medicines")
    .where({ name, is_active: true })
    .first();
};

exports.getAllMedicines = async () => {
  return db("medicines")
    .where({ is_active: true })
    .orderBy("created_at", "desc");
};

exports.findById = async (medicine_id) => {
  return db("medicines")
    .where({ medicine_id, is_active: true })
    .first();
};

exports.updateMedicine = async (medicine_id, data) => {
  const [updated] = await db("medicines")
    .where({ medicine_id })
    .update(data)
    .returning("*");

  return updated;
};

exports.softDeleteMedicine = async (medicine_id) => {
  const [deleted] = await db("medicines")
    .where({ medicine_id })
    .update({ is_active: false })
    .returning("*");

  return deleted;
};