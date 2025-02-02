const mongoose = require("mongoose");

const JournalEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Associate entry with user
  asthmaAttack: { type: String, required: true },
  symptoms: { type: String, required: true },
  comments: { type: String },
  dateCreated: { type: String, required: true },
});

module.exports = mongoose.model("JournalEntry", JournalEntrySchema);
