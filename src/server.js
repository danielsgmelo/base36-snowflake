const config = require('./config')
const app = require("./app");
const { logger } = require("./logger");
const idService = require('./services/id.service');


idService.fillBuffer().then(() =>
    app.listen(config.get('port'), () => {
        logger.info(`app listening on port ${config.get('port')}!`);
    })
)


