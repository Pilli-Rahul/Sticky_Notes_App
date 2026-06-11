const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Sticky Notes API is running" });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment (.env).");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error("Missing JWT_SECRET in environment (.env).");
  process.exit(1);
}

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB connected");

    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/notes", require("./routes/notes"));

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Stop the other server or set PORT to a different value in .env.`);
      } else {
        console.error("Server error:", err.message);
      }

      process.exit(1);
    });

  } catch (err) {
    console.error("Connection Error:", err.message);
    process.exit(1);
  }
}

startServer();
