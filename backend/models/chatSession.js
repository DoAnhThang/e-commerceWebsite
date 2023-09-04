const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSessionSchema = new Schema(
  {
    messages: [
      {
        role: { type: String, required: true },
        msg: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatSession", chatSessionSchema);
