const { User, validate } = require('../models/User');
const auth = require('../middleware/auth');
const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).send('User already registered.');

  user = new User({ name, email, password });
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send({ _id: user._id, name, email });
});

module.exports = router;
