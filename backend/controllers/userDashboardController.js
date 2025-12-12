const Booking = require("../models/Booking");
const Waitlist = require("../models/Waitlist");

const getUserDashboard = async (req, res) => {
  const userId = req.user._id;

  const today = new Date();
  const currentDate = today.toISOString().split("T")[0];
  const currentTime = today.toTimeString().slice(0, 5);

  const upcoming = await Booking.find({
    user: userId,
    status: "confirmed",
    $or: [
      { date: { $gt: currentDate } },
      { date: currentDate, startTime: { $gte: currentTime } }
    ]
  }).populate("court coach equipment.item");

  const past = await Booking.find({
    user: userId,
    status: "confirmed",
    $or: [
      { date: { $lt: currentDate } },
      { date: currentDate, endTime: { $lt: currentTime } }
    ]
  }).populate("court coach equipment.item");

  const cancelled = await Booking.find({
    user: userId,
    status: "cancelled"
  }).populate("court coach equipment.item");

  const waitlist = await Waitlist.find({
    user: userId
  }).populate("court");

  res.json({
    upcoming,
    past,
    cancelled,
    waitlist
  });
};

module.exports = {
  getUserDashboard
};
