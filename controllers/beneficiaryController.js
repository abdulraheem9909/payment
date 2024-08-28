const Beneficiary = require("../models/Beneficiary");
const User = require("../models/User");

// Add new beneficiary
exports.addBeneficiary = async (req, res) => {
  try {
    const user = await User.findById(req.body.user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingBeneficiary = await Beneficiary.findOne({
      user_id: req.body.user_id,
      name: req.body.name,
    });

    if (existingBeneficiary) {
      return res.status(409).json({
        error: "Beneficiary with the same name already exists for this user",
      });
    }

    const monthlyLimit = user.status === "verified" ? 500 : 1000;

    const beneficiary = new Beneficiary({
      ...req.body,
      monthlyLimit,
      remaining: monthlyLimit,
    });
    await beneficiary.save();

    res.status(201).json(beneficiary);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal server error" }); // Generic error for client
  }
};

// Update beneficiary
exports.updateBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!beneficiary)
      return res.status(404).json({ error: "Beneficiary not found" });

    res.status(200).json(beneficiary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete beneficiary
exports.deleteBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findByIdAndDelete(req.params.id);
    if (!beneficiary)
      return res.status(404).json({ error: "Beneficiary not found" });

    res.status(200).json({ message: "Beneficiary deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get beneficiary by ID
exports.getBeneficiaryById = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);
    if (!beneficiary)
      return res.status(404).json({ error: "Beneficiary not found" });

    res.status(200).json(beneficiary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBeneficiariesByUsername = async (req, res) => {
  try {
    const username = req.params.id; // Assuming the username is in the URL parameter

    const beneficiaries = await Beneficiary.find({ user_id: username }); // Filter by username

    res.status(200).json(beneficiaries);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal server error" }); // Generic error for client
  }
};
