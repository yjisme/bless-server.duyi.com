const mongoose = require("mongoose");

const blessSchema = new mongoose.Schema(
  {
    author: String,
    content: String,
    audioUrl: String,
    bgMusicIndex: Number,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Bless", blessSchema);
