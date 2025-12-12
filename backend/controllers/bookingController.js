const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const {
  checkCourtAvailability,
  checkCoachAvailability,
  checkEquipmentAvailability,
} = require("../utils/availability");
const { applyRules } = require("../utils/pricingEngine");
const Waitlist = require("../models/Waitlist");
const bookNextInWaitlist = require("../utils/bookNextInWaitlist");

const createBooking = async (req, res) => {
  const { court, date, startTime, endTime, equipment, coach } = req.body;
  const userId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const courtOk = await checkCourtAvailability(
      court,
      date,
      startTime,
      endTime
    );
    if (!courtOk) throw { status: 400, message: "Court unavailable" };

    if (coach) {
      const coachOk = await checkCoachAvailability(
        coach,
        date,
        startTime,
        endTime
      );
      if (!coachOk) throw { status: 400, message: "Coach unavailable" };
    }

    const equipmentOk = await checkEquipmentAvailability(
      equipment,
      date,
      startTime,
      endTime
    );
    if (!equipmentOk) throw { status: 400, message: "Equipment unavailable" };

    const price = await applyRules({
      courtId: court,
      date,
      startTime,
      endTime,
      equipment,
      coachId: coach,
    });

    const booking = await Booking.create(
      [
        {
          user: userId,
          court,
          date,
          startTime,
          endTime,
          equipment,
          coach,
          price,
          status: "confirmed",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(booking[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate(
    "court coach equipment.item"
  );
  res.json(bookings);
};

const cancelBooking = async (req, res) => {
  const bookingId = req.params.id;

  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ message: "Not found" });

  if (booking.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not allowed" });

  booking.status = "cancelled";
  await booking.save();

  await bookNextInWaitlist(
  booking.court,
  booking.date,
  booking.startTime,
  booking.endTime
);
  res.json({ message: "Booking cancelled" });
};

const joinWaitlist = async (req, res) => {
  const { court, date, startTime, endTime } = req.body;

  const already = await Waitlist.findOne({
    user: req.user._id,
    court,
    date,
    startTime,
    endTime
  });

  if (already) {
    return res.json({ message: "Already in waitlist" });
  }

  const count = await Waitlist.countDocuments({
    court,
    date,
    startTime,
    endTime
  });

  const maxQueue = 5; 

  if (count >= maxQueue) {
    return res
      .status(400)
      .json({ message: "Waitlist full for this slot" });
  }

  const added = await Waitlist.create({
    user: req.user._id,
    court,
    date,
    startTime,
    endTime
  });

  res.status(201).json(added);
};

const modifyBooking = async (req, res) => {
  const bookingId = req.params.id;
  const { court, date, startTime, endTime, equipment, coach } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ message: "Not found" });

  if (booking.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" });
  }

  if (booking.status === "cancelled") {
    return res.status(400).json({ message: "Cannot modify cancelled booking" });
  }

  const courtOk = await checkCourtAvailability(
    court,
    date,
    startTime,
    endTime
  );
  if (!courtOk) {
    return res.status(400).json({ message: "Court unavailable" });
  }

  if (coach) {
    const coachOk = await checkCoachAvailability(
      coach,
      date,
      startTime,
      endTime
    );
    if (!coachOk) {
      return res.status(400).json({ message: "Coach unavailable" });
    }
  }

  const equipmentOk = await checkEquipmentAvailability(
    equipment,
    date,
    startTime,
    endTime
  );
  if (!equipmentOk) {
    return res.status(400).json({ message: "Equipment unavailable" });
  }

  const newPrice = await applyRules({
    courtId: court,
    date,
    startTime,
    endTime,
    equipment,
    coachId: coach
  });

  booking.court = court;
  booking.date = date;
  booking.startTime = startTime;
  booking.endTime = endTime;
  booking.equipment = equipment;
  booking.coach = coach;
  booking.price = newPrice;

  await booking.save();

  res.json({ message: "Booking updated", booking });
};


module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
  joinWaitlist,
  modifyBooking
};
