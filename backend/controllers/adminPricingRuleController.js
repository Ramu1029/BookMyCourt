const PricingRule = require('../models/PricingRule');

const getAllPricingRules = async (req, res) => {
  const list = await PricingRule.find({});
  res.json(list);
};

const addPricingRule = async (req, res) => {
  const {
    ruleName,
    courtType,
    dayType = 'all',
    startHour,
    endHour,
    extraCharge = 0,
    isActive = true
  } = req.body;

  const created = await PricingRule.create({
    ruleName,
    courtType,
    dayType,
    startHour,
    endHour,
    extraCharge,
    isActive
  });

  res.status(201).json(created);
};

const updatePricingRule = async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const updated = await PricingRule.findByIdAndUpdate(id, payload, { new: true });
  res.json(updated);
};

module.exports = {
  getAllPricingRules,
  addPricingRule,
  updatePricingRule
};
