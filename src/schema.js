const config = require("config");
const Joi = require("joi");

const configSchema = Joi.object({
    id: Joi.object({
        totalBits: Joi.number().integer().positive().greater(Joi.ref('instanceBits')).required(),
        instanceBits: Joi.number().integer().positive().required(),
    }).required(),
    maxIdsPerRequest: Joi.number().integer().positive().required(),
    controlFile: Joi.object({
        path: Joi.string().required(),
        bufferSize: Joi.number().integer().positive().required(),
    }).required(),
    instance: Joi.object({
        id: Joi.number().integer().min(0).custom((value, helpers) => {
            const { id: { instanceBits } } = helpers.state.ancestors[1];
            const max = Math.pow(2, instanceBits) - 1;
            if (value > max) {
                return helpers.message(`"instance.id" must be less than or equal to ${max}`);
            }
            return value;
        }).required(),
    }).required(),
    logLevel: Joi.string().required(),
    port: Joi.number().required(),
}).required()

const requestSchema = Joi.object({
    n: Joi.number().min(1).max(config.get("maxIdsPerRequest"))
})

module.exports = {
    configSchema,
    requestSchema,
}