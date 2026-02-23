const asyncHandler = require("../../utils/asyncHandler");
const service = require("./suppliers.service");

exports.createSupplier = asyncHandler(async (req, res) => {
  const supplier = await service.createSupplier(req.body);
  res.status(201).json({
    status: "success",
    data: supplier,
  });
});

exports.getAllSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await service.getAllSuppliers();
  res.status(200).json({
    status: "success",
    results: suppliers.length,
    data: suppliers,
  });
});

exports.updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await service.updateSupplier(
    req.params.id,
    req.body
  );
  res.status(200).json({
    status: "success",
    data: supplier,
  });
});

exports.deleteSupplier = asyncHandler(async (req, res) => {
  await service.deleteSupplier(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Supplier deleted successfully",
  });
});