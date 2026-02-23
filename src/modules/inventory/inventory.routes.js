const express = require("express");
const router = express.Router();

const controller = require("./inventory.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");

// Add stock (Owner + Pharmacist)
router.post(
  "/batch",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.addStockBatch
);

// View stock
router.get(
  "/:medicineId",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.getStockByMedicine
);

module.exports = router;