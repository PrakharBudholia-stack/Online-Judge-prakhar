// routes/compileRoutes.js
const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const { compileCode, submitSolution } = require('../controllers/compileController');
const router = express.Router();

router.post('/compile', verifyToken, compileCode);
router.post('/submit', verifyToken, submitSolution);

module.exports = router;