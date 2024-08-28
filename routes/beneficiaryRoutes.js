const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');

// Beneficiary CRUD routes
router.post('/', beneficiaryController.addBeneficiary);
router.get('/:id', beneficiaryController.getAllBeneficiariesByUsername);
router.put('/:id', beneficiaryController.updateBeneficiary);
router.delete('/:id', beneficiaryController.deleteBeneficiary);

module.exports = router;
