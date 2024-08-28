const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Beneficiary = require('../models/Beneficiary');

exports.createTransaction = async (req, res) => {
    try {
        const { user_id, beneficiary_id, amount } = req.body;

        const user = await User.findById(user_id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const beneficiary = await Beneficiary.findOne({
            user_id: user_id,
            _id: beneficiary_id,
          });
        if (!beneficiary) return res.status(404).json({ error: 'Beneficiary not found' });

        if (beneficiary.remaining < amount) {
            return res.status(400).json({ error: 'Amount limit exceeded for this beneficiary.' });
        }

        if (user.remainingMonthlyLimit < amount) {
            return res.status(400).json({ error: 'Amount limit exceeded for this user.' });
        }

        beneficiary.remaining -= amount;
        user.remainingMonthlyLimit -= amount;
        user.availableBalance -= amount;

        await beneficiary.save();
        await user.save();

        const transaction = new Transaction(req.body);
        await transaction.save();

        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all transactions for a user
exports.getTransactionsByUserId = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user_id: req.params.user_id }).populate('beneficiary_id');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
