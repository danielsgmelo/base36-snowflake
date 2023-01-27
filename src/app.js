const express = require("express");
const { logger } = require("./logger");
const app = express();
const idService = require('./services/id.service')
const healthService = require('./services/health.service');
const { requestSchema } = require("./schema");
const Promise = require("bluebird");
app.get("/health", (_, res) => {
    if (healthService.getHealth()) {
        return res.status(200).send('UP')
    }
    res.status(500).send('DOWN')
});

app.post("/", async (req, res) => {
    logger.debug('new id request', req.query)
    try {
        req.query = await requestSchema.validateAsync(req.query, { allowUnknown: false });
    } catch (error) {
        return res.status(400).json(error.message)
    }
    try {
        const n = req.query.n;
        const response = n > 1 ?
            await Promise.map(Array(n), () => idService.nextId()) :
            await idService.nextId();
        logger.debug('successful response', { response })
        res.status(201).json(response);
    } catch (error) {
        logger.error('got an error', { error })
        res.status(500).send();
    }
});


module.exports = app;