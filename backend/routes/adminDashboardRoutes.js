const express = require("express");
const router = express.Router();

const { getAdminDashboard } = require("../controllers/adminDashboardController");
const { auth, admin } = require("../middleware/auth");

router.get("/", auth, admin, getAdminDashboard);

module.exports = router;
