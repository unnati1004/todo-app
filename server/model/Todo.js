// models/Todo.js
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true
  },
  complete: {
    type: Boolean,
    default: false
  }
});

// Create and export the Todo model
module.exports = mongoose.model("Todo", todoSchema);
