const { Schema, model } = require("mongoose");

const notesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
    required: true,
  },

  isPinned: {
    type: Boolean,
    default: false,
  },

  userId: {
    type: String,
    required: true,
  },

  createdOn: {
    type: Date,
    default: new Date().getTime(),
  },
});

module.exports = model("Notes", notesSchema);
