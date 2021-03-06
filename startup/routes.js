const express = require('express');
const error = require('../middleware/error');
require('express-async-errors');

module.exports = (app) => {
  // Body parser
  app.use(express.json({ extended: false }));

  // Routers
  app.use('/api/genres', require('../routes/genres'));
  app.use('/api/customers', require('../routes/customers'));
  app.use('/api/movies', require('../routes/movies'));
  app.use('/api/rentals', require('../routes/rentals'));
  app.use('/api/users', require('../routes/users'));
  app.use('/api/auth', require('../routes/auth'));
  app.use('/api/returns', require('../routes/returns'));

  // Error Handler
  app.use(error);
}
