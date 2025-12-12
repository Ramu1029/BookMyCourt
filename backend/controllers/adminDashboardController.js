const Booking = require("../models/Booking");
const Waitlist = require("../models/Waitlist");

const getAdminDashboard = async (req, res) => {
  const today = new Date();
  const currentDate = today.toISOString().split("T")[0];
  const currentTime = today.toTimeString().slice(0, 5);

  const upcoming = await Booking.find({
    status: "confirmed",
    $or: [
      { date: { $gt: currentDate } },
      { date: currentDate, startTime: { $gte: currentTime } }
    ]
  }).populate("user court coach equipment.item");

  const past = await Booking.find({
    status: "confirmed",
    $or: [
      { date: { $lt: currentDate } },
      { date: currentDate, endTime: { $lt: currentTime } }
    ]
  }).populate("user court coach equipment.item");

  const cancelled = await Booking.find({
    status: "cancelled"
  }).populate("user court coach equipment.item");

  const waitlist = await Waitlist.find({})
    .populate("user court")
    .sort({ joinedAt: 1 });

  const stats = {
    totalBookings: await Booking.countDocuments(),
    totalUpcoming: upcoming.length,
    totalPast: past.length,
    totalCancelled: cancelled.length,
    totalWaitlist: await Waitlist.countDocuments()
  };

  res.json({
    stats,
    upcoming,
    past,
    cancelled,
    waitlist
  });
};

module.exports = {
  getAdminDashboard
};
