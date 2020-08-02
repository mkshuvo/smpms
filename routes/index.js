const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => {
  res.render("welcome", { title: "Dashboard", Layout: "layoutapp" });
});

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    user: req.user,
    title: "Dashboard",
    layout: "layoutapp",
  })
);

module.exports = router;
