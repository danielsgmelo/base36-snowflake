const config = require('config');
const fs = require('fs/promises');
const { logger } = require('../logger');

const read = async () => {
    try {
        return await fs.readFile(config.get('controlFile.path'), { encoding: 'utf8' })
    } catch (error) {
        if (error.code === 'ENOENT') {
            logger.error(`control file does not exist. please create one (try \`echo -n -1 > ${config.get('controlFile.path')}\`) and restart the service`);
            process.exit(-1);
        }
        throw error;
    }
};
const write = async (value) => fs.writeFile(config.get('controlFile.path'), value);

module.exports = {
    read,
    write
}
