const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  expertise: {
    type: String,
    required: true
  },
  fee: {
    type: Number,
    required: true,
    default: 0
  },
  availability: [
    {
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model("Coach", coachSchema);
