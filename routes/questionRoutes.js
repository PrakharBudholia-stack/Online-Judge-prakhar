// routes/questionRoutes.js
const express = require('express');
const { addQuestion, getAllQuestions, getQuestionById, deleteQuestion } = require('../controllers/questionController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/questions', verifyToken, addQuestion);
router.get('/questions', verifyToken, getAllQuestions);
router.get('/questions/:id', verifyToken, getQuestionById);
router.delete('/questions/:id', verifyToken, deleteQuestion);

module.exports = router;