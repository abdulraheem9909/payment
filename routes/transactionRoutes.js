const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Transaction routes
router.post('/', transactionController.createTransaction);
router.get('/user/:user_id', transactionController.getTransactionsByUserId);

module.exports = router;
