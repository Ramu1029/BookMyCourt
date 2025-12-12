const express = require("express");
const router = express.Router();
const { auth, admin } = require("../middleware/auth");

const {
  getAllPricingRules,
  addPricingRule,
  updatePricingRule
} = require("../controllers/adminPricingRuleController");

router.get("/",  getAllPricingRules);
router.post("/", auth, admin, addPricingRule);
router.put("/:id", auth, admin, updatePricingRule);

module.exports = router;
