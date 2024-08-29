const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Beneficiary = require("../models/Beneficiary");

// User signup
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userDate = {
      ...req.body,
      password: hashedPassword,
    };

    const user = new User(userDate);
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    const data = {
      name: user?.name,
      _id: user?._id,
      email: user?.email,
      status: user?.status,
      remainingMonthlyLimit: user?.remainingMonthlyLimit,
      currentMonth: user?.currentMonth,
      availableBalance: user?.availableBalance,
      createdAt: user?.createdAt,
    };
    res.status(200).json({ token, user: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Reset user (same as before)
exports.resetUsers = async (req, res) => {
  try {
    const { currentMonth } = req.body;

    // Fetch all users
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    for (const user of users) {
      // Update each user
      user.currentMonth = currentMonth;
      user.remainingMonthlyLimit = 3000;
      await user.save();

      // Find and update all beneficiaries for the current user
      const beneficiaries = await Beneficiary.find({ user_id: user._id });
      const monthlyLimit = user.status === "verified" ? 500 : 1000;

      for (const beneficiary of beneficiaries) {
        beneficiary.monthlyLimit = monthlyLimit;
        beneficiary.remaining = monthlyLimit;
        await beneficiary.save();
      }
    }

    res
      .status(200)
      .json({
        message: "All users and their beneficiaries reset successfully",
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const { userId, ...updateFields } = req.body;

    // Find the user by ID and update with the fields provided
    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

