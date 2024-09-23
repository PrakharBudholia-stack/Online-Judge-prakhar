// controllers/questionController.js
const Question = require('../models/Question');

exports.addQuestion = async (req, res) => {
  const { description, testCases } = req.body;
  console.log('Add Question request received:', { description, testCases });
  try {
    const question = new Question({ description, testCases });
    await question.save();
    console.log('Question saved to database:', question);
    res.status(201).send('Question added');
  } catch (error) {
    console.error('Error adding question:', error.message);
    res.status(400).send(error.message);
  }
};

exports.getAllQuestions = async (req, res) => {
  console.log('Get All Questions request received');
  try {
    const questions = await Question.find();
    console.log('Questions retrieved from database:', questions);
    res.json(questions);
  } catch (error) {
    console.error('Error retrieving questions:', error.message);
    res.status(500).send(error.message);
  }
};

exports.getQuestionById = async (req, res) => {
  const { id } = req.params;
  console.log('Get Question By ID request received:', id);
  try {
    const question = await Question.findById(id);
    if (!question) {
      console.log('Question not found:', id);
      return res.status(404).send('Question not found');
    }
    console.log('Question retrieved from database:', question);
    res.json(question);
  } catch (error) {
    console.error('Error retrieving question:', error.message);
    res.status(500).send(error.message);
  }
};

exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  console.log('Delete Question request received:', id);
  try {
    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      console.log('Question not found:', id);
      return res.status(404).send('Question not found');
    }
    console.log('Question deleted from database:', question);
    res.send('Question deleted');
  } catch (error) {
    console.error('Error deleting question:', error.message);
    res.status(500).send(error.message);
  }
};