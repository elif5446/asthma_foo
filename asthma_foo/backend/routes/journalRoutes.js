const express = require("express");
const mongoose = require("mongoose");
const JournalEntry = require("../models/JournalEntry");

const router = express.Router();

// POST request to save a new journal entry
router.post("/", async (req, res) => {
  console.log("Received request at POST /api/journal");

  try {
    const { userId, asthmaAttack, symptoms, comments, dateCreated } = req.body;
    console.log("Received journal entry:", req.body);

    // Check if `userId` and required fields are provided
    if (!userId || !asthmaAttack || !symptoms) {
      console.log("Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate `userId` format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId format:", userId);
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Create a new journal entry
    const newEntry = new JournalEntry({
      userId: new mongoose.Types.ObjectId(userId),
      asthmaAttack,
      symptoms,
      comments,
      dateCreated: date ? new Date(date) : new Date(),
    });

    // Save the journal entry in MongoDB
    await newEntry.save();
    console.log("Journal entry saved successfully:", newEntry);

    // Send back the saved entry
    res.status(201).json(newEntry);
  } catch (err) {
    console.error("Error saving journal entry:", err);
    res.status(500).json({ error: "Failed to create journal entry" });
  }
});

// Get all journal entries for a specific userId
router.get("/:userId", async (req, res) => {
  try {
    console.log("Received request at GET /api/journal");
    const { userId } = req.params;
    console.log("Fetching journal entries for userId:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId format:", userId);
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const entries = await JournalEntry.find({ userId });

    if (!entries.length) {
      console.log("No journal entries found for this user.");
      return res.json([]);
    }

    console.log("Retrieved journal entries:", entries);
    res.json(entries);
  } catch (err) {
    console.error("Error fetching journal entries:", err);
    res.status(500).json({ error: "Failed to fetch journal entries" });
  }
});

module.exports = router;
