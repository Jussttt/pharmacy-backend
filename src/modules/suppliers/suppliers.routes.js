const express = require("express");
const router = express.Router();

const controller = require("./suppliers.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");

// Owner only
router.post(
  "/",
  authenticate,
  authorizeRoles("Owner"),
  controller.createSupplier
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("Owner"),
  controller.updateSupplier
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("Owner"),
  controller.deleteSupplier
);

// Owner + Pharmacist can view
router.get(
  "/",
  authenticate,
  authorizeRoles("Owner", "Pharmacist"),
  controller.getAllSuppliers
);

module.exports = router;