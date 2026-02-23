const AppError = require("../../utils/AppError");
const repo = require("./suppliers.repository");

exports.createSupplier = async (data) => {
  const { supplier_name, phone, email, lead_time_days } = data;

  if (!supplier_name) {
    throw new AppError("Supplier name is required", 400);
  }

  const existing = await repo.findByName(supplier_name);

  if (existing) {
    throw new AppError("Supplier already exists", 409);
  }

  return repo.createSupplier({
    supplier_name,
    phone,
    email,
    lead_time_days: lead_time_days || 3,
  });
};

exports.getAllSuppliers = async () => {
  return repo.getAllSuppliers();
};

exports.updateSupplier = async (supplier_id, data) => {
  const supplier = await repo.findById(supplier_id);

  if (!supplier) {
    throw new AppError("Supplier not found", 404);
  }

  return repo.updateSupplier(supplier_id, data);
};

exports.deleteSupplier = async (supplier_id) => {
  const supplier = await repo.findById(supplier_id);

  if (!supplier) {
    throw new AppError("Supplier not found", 404);
  }

  return repo.softDeleteSupplier(supplier_id);
};