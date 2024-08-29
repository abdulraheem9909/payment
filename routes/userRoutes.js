const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User authentication routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Reset user route
router.post('/reset', userController.resetUsers);
router.put('/update', userController.updateUser);

module.exports = router;
