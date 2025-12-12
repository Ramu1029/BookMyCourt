const { applyRules } = require('../utils/pricingEngine');

const getPrice = async (req, res) => {
  const { courtId, date, startTime, endTime, equipment, coachId } = req.body;
  const price = await applyRules({ courtId, date, startTime, endTime, equipment, coachId });
  res.json({ price });
};

module.exports = { getPrice };
