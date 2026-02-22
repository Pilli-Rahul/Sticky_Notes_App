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
  },
  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);