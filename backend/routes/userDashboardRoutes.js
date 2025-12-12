const express = require("express");
const router = express.Router();

const { getUserDashboard } = require("../controllers/userDashboardController");
const { auth } = require("../middleware/auth");

router.get("/", auth, getUserDashboard);

module.exports = router;
