const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  beneficiary_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary', required: true },
  amount: { type: Number, required: true },
  purpose: { type: String, required: true },
  note: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
