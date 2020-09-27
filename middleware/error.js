const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error({
    message: err.message,
    level: err.level,
    stack: err.stack,
    meta: err
  });

  res.status(500).send('Something failed.');
}
