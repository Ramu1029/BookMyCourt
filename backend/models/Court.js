const mongoose = require("mongoose");

const courtSchema = new mongoose.Schema(
  {
    name: String,
    // allow arbitrary court types (e.g. 'badminton', 'tennis', etc.)
    type: { type: String, required: true },
    basePrice: { type: Number, default: 100 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Court", courtSchema);
