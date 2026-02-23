const asyncHandler = require("../../utils/asyncHandler");
const service = require("./inventory.service");

exports.addStockBatch = asyncHandler(async (req, res) => {
  const batch = await service.addStockBatch(req.body);

  res.status(201).json({
    status: "success",
    data: batch,
  });
});

exports.getStockByMedicine = asyncHandler(async (req, res) => {
  const stock = await service.getStockByMedicine(
    req.params.medicineId
  );

  res.status(200).json({
    status: "success",
    results: stock.length,
    data: stock,
  });
});