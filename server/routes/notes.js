const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Note = require("../models/note");

// CREATE
router.post("/", auth, async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      user: req.user.userId
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// READ ALL
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;