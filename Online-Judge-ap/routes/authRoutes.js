// routes/authRoutes.js
const express = require('express');
const { register, login, logout, refreshToken } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

module.exports = router;