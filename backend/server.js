const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
app.use(cors());
app.use(express.json());

// Your routes here
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

module.exports = app; // <-- IMPORTANT for Vercel
