const express = require("express");
const router = express.Router();
const authenticate = require("./middlewares/auth.middleware");

router.use("/auth", require("./modules/auth/auth.routes"));
router.use("/suppliers", require("./modules/suppliers/suppliers.routes"));
router.use("/medicines", require("./modules/medicines/medicines.routes"));
router.use("/inventory", require("./modules/inventory/inventory.routes"));
router.use("/sales", require("./modules/sales/sales.routes"));
router.use("/reports", require("./modules/reports/reports.routes"));
// router.get("/protected", authenticate, (req, res) => {
//   res.json({
//     message: "Protected route accessed",
//     user: req.user,
//   });
// });

module.exports = router;