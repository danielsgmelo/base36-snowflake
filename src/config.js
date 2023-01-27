const config = require("config");
const Joi = require("joi");
const { logger } = require("./logger");
const { configSchema } = require("./schema")

const configObj = config.util.toObject();
logger.info('validating config', configObj)
const value = configSchema.validate(configObj, { allowUnknown: false, convert: false });
if (value && value.error) {
    logger.error('bad config', value.error)
    process.exit(-3);
}
logger.info('config looks good')

module.exports = config
