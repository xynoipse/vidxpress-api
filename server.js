const express = require('express');
const config = require('config');
const logger = require('./utils/logger');

const app = express();

require('./startup/logging')();
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/routes')(app);

const PORT = process.env.PORT || config.get('port');
app.listen(PORT, () => logger.info(`Server running in ${app.get('env')} mode on port ${PORT}`));
