const express = require("express");
const router = express.Router();
const {
  getAllEquipment,
  addEquipment,
  updateEquipment,
} = require("../controllers/equipmentController");
const { auth, admin } = require("../middleware/auth");

router.get("/", getAllEquipment);
router.post("/", auth, admin, addEquipment);
router.put("/:id", auth, admin, updateEquipment);

module.exports = router;
