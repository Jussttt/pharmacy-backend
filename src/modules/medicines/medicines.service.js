const AppError = require("../../utils/AppError");
const repo = require("./medicines.repository");

exports.createMedicine = async (data) => {
  const { name } = data;

  if (!name) {
    throw new AppError("Medicine name is required", 400);
  }

  const existing = await repo.findByName(name);

  if (existing) {
    throw new AppError("Medicine already exists", 409);
  }

  return repo.createMedicine(data);
};

exports.getAllMedicines = async () => {
  return repo.getAllMedicines();
};

exports.updateMedicine = async (id, data) => {
  const medicine = await repo.findById(id);

  if (!medicine) {
    throw new AppError("Medicine not found", 404);
  }

  return repo.updateMedicine(id, data);
};

exports.deleteMedicine = async (id) => {
  const medicine = await repo.findById(id);

  if (!medicine) {
    throw new AppError("Medicine not found", 404);
  }

  return repo.softDeleteMedicine(id);
};