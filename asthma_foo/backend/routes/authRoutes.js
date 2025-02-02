// This handles user registration, login, and authentication.

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔍 Received request data:", { email, password }); // Log request

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists:", existingUser);
      return res.status(400).json({ error: "Email already in use" });
    }

    // Create a new user
    const newUser = new User({ email, password });
    console.log("🛠️ Creating new user:", newUser);

    await newUser.save();
    console.log("User saved successfully!");

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Log in an existing user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔍 Login Attempt for:", email); // Log email being used

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log(" User not found");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Log stored password and entered password for debugging
    console.log("🔑 Stored Password:", user.password);
    console.log("🔑 Entered Password:", password);

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(" Password Match:", isMatch);

    if (!isMatch) {
      console.log(" Passwords do not match");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("Login Successful!");
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error(" Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
