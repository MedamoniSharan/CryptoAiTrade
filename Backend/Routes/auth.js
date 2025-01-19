const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../Models/Userschema');
const router = express.Router();
const SECRET_KEY = '1df90549748dbe5aa8b2144e8e40ad4449efa018f2f6ae5a684f20d2da6cf34550c938fd64042aef81637692079e016db65861e96665ac26ff7efcf07693b25a';

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ token, message: 'Account created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating account' });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token,user, message: 'Signed in successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in' });
  }
});

module.exports = router;
