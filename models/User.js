const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, enum: ['verified', 'not_verified'], default: 'not_verified' },
  remainingMonthlyLimit: { type: Number, default: 3000 },
  currentMonth: { type: String, required: true },
  availableBalance: { type: Number, default: 10000 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
