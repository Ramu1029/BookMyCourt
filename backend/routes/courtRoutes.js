const express = require("express");
const router = express.Router();
const {
  listCourts,
  createCourt,
  updateCourt,
  disableCourt,
} = require("../controllers/courtController");
const { auth, admin } = require("../middleware/auth");

router.get("/", listCourts);

router.post("/", auth, admin, createCourt);
router.post("/admin", auth, admin, createCourt);
router.put("/admin/:id", auth, admin, updateCourt);
router.put("/admin/disable/:id", auth, admin, disableCourt);

module.exports = router;
