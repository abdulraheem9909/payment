const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  monthlyLimit: { type: Number, default: 0 },
  remaining: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
