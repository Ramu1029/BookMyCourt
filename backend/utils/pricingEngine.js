const PricingRule = require('../models/PricingRule');
const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');

const toMinutes = (time) => {
  const [hh, mm] = time.split(':').map(Number);
  return hh * 60 + (mm || 0);
};

const intervalsOverlap = (aStart, aEnd, bStart, bEnd) => {
  return !(aEnd <= bStart || aStart >= bEnd);
};

const isWeekend = (dateStr) => {
  const d = new Date(dateStr);
  const day = d.getDay(); // 0 Sun .. 6 Sat
  return day === 0 || day === 6;
};

const applyRules = async ({ courtId, date, startTime, endTime, equipment = [], coachId }) => {
  const court = await Court.findById(courtId);
  let total = court ? court.basePrice || 0 : 0;

  // equipment fees
  for (let e of equipment || []) {
    const item = await Equipment.findById(e.item);
    const qty = e.qty || 1;
    total += (item ? (item.price || 0) : 0) * qty;
  }

  // coach fee
  if (coachId) {
    const coach = await Coach.findById(coachId);
    total += coach ? (coach.fee || 0) : 0;
  }

  
  const rules = await PricingRule.find({ isActive: true });

  const reqStart = toMinutes(startTime);
  const reqEnd = toMinutes(endTime);
  const weekend = isWeekend(date);

  for (let r of rules) {
    // court type match (allow 'all' in rule.courtType to mean any)
    if (r.courtType !== 'all' && court && r.courtType !== court.type) continue;

    // dayType match
    if (r.dayType === 'weekday' && weekend) continue;
    if (r.dayType === 'weekend' && !weekend) continue;

    // (rule hours are in full hours, convert to minutes)
    const ruleStart = r.startHour * 60;
    const ruleEnd = r.endHour * 60;
    if (!intervalsOverlap(reqStart, reqEnd, ruleStart, ruleEnd)) continue;

    // extraCharge
    total += r.extraCharge || 0;
  }

  return Math.round(total * 100) / 100;
};

module.exports = {
  applyRules
};
