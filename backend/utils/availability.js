const Booking = require("../models/Booking");
const Equipment = require("../models/Equipment");
const Coach = require("../models/Coach");

const timesOverlap = (aStart, aEnd, bStart, bEnd) => {
  return !(aEnd <= bStart || aStart >= bEnd);
};

const checkCourtAvailability = async (courtId, date, startTime, endTime) => {
  const conflicting = await Booking.findOne({
    court: courtId,
    date,
    status: "confirmed",
    $or: [
      {
        $and: [
          { startTime: { $lte: startTime } },
          { endTime: { $gt: startTime } },
        ],
      },
      {
        $and: [{ startTime: { $lt: endTime } }, { endTime: { $gte: endTime } }],
      },
      {
        $and: [
          { startTime: { $gte: startTime } },
          { endTime: { $lte: endTime } },
        ],
      },
    ],
  });
  return !conflicting;
};

const toMinutes = (time) => {
  const [h, m] = time.split(":");
  return parseInt(h) * 60 + parseInt(m);
};

const checkCoachAvailability = async (coachId, date, startTime, endTime) => {
  if (!coachId) return true;

  const coach = await Coach.findById(coachId);
  if (!coach) return false;

  const bookingDay = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });

  const daySlot = coach.availability.find((slot) => slot.day === bookingDay);
  if (!daySlot) return false;

  const reqStart = toMinutes(startTime);
  const reqEnd = toMinutes(endTime);

  const slotStart = toMinutes(daySlot.startTime);
  const slotEnd = toMinutes(daySlot.endTime);

  if (!(reqStart >= slotStart && reqEnd <= slotEnd)) {
    return false;
  }

  const overlapping = await Booking.findOne({
    coach: coachId,
    date,
    status: "confirmed",
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
      },
    ],
  });

  return !overlapping;
};

const checkEquipmentAvailability = async (
  equipmentRequests,
  date,
  startTime,
  endTime
) => {
  if (!equipmentRequests || equipmentRequests.length === 0) return true;
  const BookingDoc = Booking;
  for (let req of equipmentRequests) {
    const itemId = req.item;
    const qtyNeeded = req.qty || 1;
    const total = (await Equipment.findById(itemId)).total;
    const bookingsUsing = await BookingDoc.aggregate([
      {
        $match: {
          date,
          status: "confirmed",
          "equipment.item": itemId,
          $or: [
            {
              $and: [
                { startTime: { $lte: startTime } },
                { endTime: { $gt: startTime } },
              ],
            },
            {
              $and: [
                { startTime: { $lt: endTime } },
                { endTime: { $gte: endTime } },
              ],
            },
            {
              $and: [
                { startTime: { $gte: startTime } },
                { endTime: { $lte: endTime } },
              ],
            },
          ],
        },
      },
      { $unwind: "$equipment" },
      { $match: { "equipment.item": itemId } },
      { $group: { _id: null, qty: { $sum: "$equipment.qty" } } },
    ]);
    const used = bookingsUsing[0] ? bookingsUsing[0].qty : 0;
    if (used + qtyNeeded > total) return false;
  }
  return true;
};

module.exports = {
  checkCourtAvailability,
  checkCoachAvailability,
  checkEquipmentAvailability,
};
