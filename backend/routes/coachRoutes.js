const express = require("express");
const router = express.Router();

const {
  getAllCoaches,
  addCoach,
  updateCoach
} = require("../controllers/coachController");

const { auth, admin } = require("../middleware/auth");

router.get("/", auth, admin, getAllCoaches);
router.post("/", auth, admin, addCoach);
router.put("/:id", auth, admin, updateCoach);

module.exports = router;
