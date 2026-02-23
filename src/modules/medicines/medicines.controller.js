const asyncHandler = require("../../utils/asyncHandler");
const service = require("./medicines.service");

exports.createMedicine = asyncHandler(async (req, res) => {
  const medicine = await service.createMedicine(req.body);

  res.status(201).json({
    status: "success",
    data: medicine,
  });
});

exports.getAllMedicines = asyncHandler(async (req, res) => {
  const medicines = await service.getAllMedicines();

  res.status(200).json({
    status: "success",
    results: medicines.length,
    data: medicines,
  });
});

exports.updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await service.updateMedicine(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: "success",
    data: medicine,
  });
});

exports.deleteMedicine = asyncHandler(async (req, res) => {
  await service.deleteMedicine(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Medicine deleted successfully",
  });
});