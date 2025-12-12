const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
  ruleName: { type: String, required: true },
  courtType: { type: String, required: true }, // Court type ('indoor'|'outdoor')
  dayType: { type: String, enum: ['weekday','weekend','all'], default: 'all' },
  startHour: { type: Number, required: true }, // 0-23
  endHour: { type: Number, required: true },   // 0-23
  extraCharge: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
