const Waitlist = require("../models/Waitlist");
const Booking = require("../models/Booking");
const notifyUser = require("./notify");

const mongoose = require("mongoose");

const bookNextInWaitlist = async (court, date, startTime, endTime) => {
  const nextUser = await Waitlist.findOne({
    court,
    date,
    startTime,
    endTime,
    notified: false
  }).sort({ joinedAt: 1 });

  if (!nextUser) return null;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const created = await Booking.create([{
      user: nextUser.user,
      court,
      date,
      startTime,
      endTime,
      equipment: [],
      coach: null,
      price: 0,
      status: "confirmed"
    }], { session });

    nextUser.notified = true;
    await nextUser.save({ session });
    notifyUser(nextUser.user, "You have been booked from waitlist.");

    await session.commitTransaction();
    session.endSession();

    return created[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return null;
  }
};

module.exports = bookNextInWaitlist;
