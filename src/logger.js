const config = require('config');
const winston = require('winston');

const logger = winston.createLogger({
    level: config.get('logLevel'),
    format: winston.format.json(),
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.json(),
    }));
} else {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

module.exports = { logger }