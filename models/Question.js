// models/Question.js
const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true }
});

const questionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  testCases: [testCaseSchema]
});

module.exports = mongoose.model('Question', questionSchema);