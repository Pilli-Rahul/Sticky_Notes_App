const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  isPinned: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: "#111827"
  }
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);