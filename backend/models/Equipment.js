const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: String,
  total: { type: Number, default: 0 },
  price: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
