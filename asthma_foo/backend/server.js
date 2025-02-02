// This sets up Express, MongoDB connection, and API routes.

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import API routes
const authRoutes = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");

const app = express();
app.use(cors());
app.use(express.json()); // Allows parsing of JSON requests

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Use routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/journal", journalRoutes); // Journal entry routes

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
