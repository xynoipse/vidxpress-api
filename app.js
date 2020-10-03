const express = require('express');
const app = express();

require('./startup/logging')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/middlewares')(app);
require('./startup/routes')(app);

module.exports = app;
