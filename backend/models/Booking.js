const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:MM
  endTime: { type: String, required: true },   // HH:MM
  equipment: [{ item: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }, qty: Number }],
  coach: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
  price: { type: Number, default: 0 },
  status: { type: String, enum: ['confirmed','cancelled'], default: 'confirmed' }
}, { timestamps: true });

bookingSchema.index({ court: 1, date: 1, startTime: 1, endTime: 1 });
module.exports = mongoose.model('Booking', bookingSchema);
