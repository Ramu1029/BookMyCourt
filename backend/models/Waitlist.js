const mongoose = require("mongoose");

const waitlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  court: { type: mongoose.Schema.Types.ObjectId, ref: "Court", required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  notified: { type: Boolean, default: false }
});

module.exports = mongoose.model("Waitlist", waitlistSchema);
