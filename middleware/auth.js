const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = await User.findById(decoded.id);
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};
