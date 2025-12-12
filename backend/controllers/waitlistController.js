const Waitlist = require("../models/Waitlist");

const getMyWaitlist = async (req, res) => {
  const list = await Waitlist.find({ user: req.user._id })
    .populate("court")
    .sort({ joinedAt: 1 });

  res.json(list);
};

const getAllWaitlist = async (req, res) => {
  const list = await Waitlist.find({})
    .populate("user")
    .populate("court")
    .sort({ joinedAt: 1 });

  res.json(list);
};

module.exports = {
  getMyWaitlist,
  getAllWaitlist
};
