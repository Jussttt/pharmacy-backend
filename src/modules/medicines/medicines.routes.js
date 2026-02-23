const express = require("express");
const router = express.Router();

const controller = require("./medicines.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");

// Owner only
router.post(
  "/",
  authenticate,
  authorizeRoles("Owner"),
  controller.createMedicine
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("Owner"),
  controller.updateMedicine
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("Owner"),
  controller.deleteMedicine
);

// Owner + Pharmacist
router.get(
  "/",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.getAllMedicines
);

module.exports = router;