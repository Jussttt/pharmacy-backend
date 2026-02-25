const express = require("express");
const router = express.Router();
const authService = require("../modules/auth/auth.service");


const dashboardService = require("../modules/dashboard/dashboard.service");
const { verifyViewToken } = require("../middlewares/viewAuth.middleware");

router.get("/dashboard", verifyViewToken, async (req, res) => {
  try {
    const dashboardData = await dashboardService.getDashboardData(req.user);

    res.render("dashboard", {
      user: req.user,
      dashboard: dashboardData,
      activePage: "dashboard"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Dashboard error");
  }
});

// Signup page
router.get("/signup", (req, res) => {
  res.render("signup", { error: null });
});

// Handle signup
router.post("/signup", async (req, res) => {
  try {
    await authService.register(req.body);
    res.redirect("/login");
  } catch (err) {
    res.render("signup", { error: err.message });
  }
});

// Render login page
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// Handle login
router.post("/login", async (req, res) => {
  try {
    const result = await authService.login(req.body);

    // Set JWT in httpOnly cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false, // true in production (https)
      maxAge: 8 * 60 * 60 * 1000
    });

    res.redirect("/dashboard");

  } catch (err) {
    res.render("login", { error: err.message });
  }
});


// Protected Dashboard
router.get("/dashboard", verifyViewToken, (req, res) => {
  res.render("dashboard", { user: req.user });
});

// Logout


router.get("/billing", verifyViewToken, (req, res) => {
  res.render("billing", {
    user: req.user,
    activePage: "billing"
  });
});
// Sales Report Page
router.get("/sales", verifyViewToken, (req, res) => {

    if (req.user.role !== "Owner") {
        return res.status(403).render("403");
    }

    res.render("sales", { user: req.user });
});
router.get("/inventory", verifyViewToken, (req, res) => {

    if (req.user.role === "Staff") {
        return res.status(403).render("403");
    }

    res.render("inventory", {
        user: req.user,
        activePage: "inventory"
    });
});
router.get("/add-medicine", verifyViewToken, (req, res) => {

    if (req.user.role !== "Owner") {
        return res.status(403).render("403");
    }

    res.render("addMedicine", { user: req.user });
});
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

router.get("/add-medicine", verifyViewToken, (req, res) => {

    if (req.user.role !== "Owner") {
        return res.status(403).render("403");
    }

    res.render("addMedicine", {
        user: req.user,
        activePage: "inventory"
    });
});

module.exports = router;