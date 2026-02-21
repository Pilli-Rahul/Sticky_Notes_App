const express = require("express");
const router = express.Router();
const Note = require("../models/note");

// CREATE
router.post("/", async (req, res) => {
  const note = await Note.create(req.body);
  res.json(note);
});

// READ ALL
router.get("/", async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(note);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;