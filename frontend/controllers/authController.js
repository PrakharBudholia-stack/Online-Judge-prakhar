const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  console.log('Register request:', { email, password });
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).send('User already registered with this email');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed:', hashedPassword);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    console.log('User saved to database:', user);
    res.status(201).send('User registered');
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(400).send(error.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', { email, password });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).send('Invalid email or password');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).send('Invalid email or password');
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(400).send(error.message);
  }
};

exports.logout = (req, res) => {
  console.log('Logout request received');
  res.send('Logged out');
};

exports.refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};