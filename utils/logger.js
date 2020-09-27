const config = require('config');
const { createLogger, transports, format } = require('winston');
require('winston-mongodb');

const db = process.env.MONGO_URI || config.get('mongoURI');

const logger = createLogger({
  format: format.json(),
  transports: [
    new transports.File({ filename: 'logs/logfile.log' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.MongoDB({ db, options: { useUnifiedTopology: true }, metaKey: 'meta' })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' })
  ]
});

module.exports = logger;
