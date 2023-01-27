const config = require('config');
const { logger } = require('../logger');
const fileService = require("./file.service")
const healthService = require("./health.service")

const buffer = []
let nextOffset;
const maxOffset = Math.pow(2, config.get('id.totalBits') - config.get('id.instanceBits')) - 1
const instanceIdBitStr = config.get('instance.id').toString(2).padStart(config.get('id.instanceBits'), '0')
const padLength = Math.pow(2, config.get('id.totalBits')).toString(36).length

const nextId = async () => {
    // if (!buffer.length) await fillBuffer();
    // a simple if like the one above is not enough!
    //
    // under certain race conditions the buffer may  
    // be empty by the time the promise returned by
    // fillBuffer() resolves and execution 
    // returns here
    //
    // this while loop ensures there is at least
    // one id to pull from the buffer
    while (!buffer.length) {
        await fillBuffer();
    }
    const seq = buffer.shift();
    if (seq > maxOffset) {
        const msg = 'we ran out of unique IDs!';
        logger.error(msg, { seq, maxOffset, buffer });
        healthService.setHealth(false);
        throw new Error(msg)
    }

    const seqBitStr = seq.toString(2).padStart(config.get('id.totalBits') - config.get('id.instanceBits'), '0')
    const bitStr = "".concat(instanceIdBitStr, seqBitStr)
    const id = parseInt(bitStr, 2).toString(36).toUpperCase().padStart(padLength, '0')
    logger.debug('nextId', { maxOffset, instanceIdBitStr, seqBitStr, bitStr, seq, id, padLength, buffer })

    return { id }
}

const fillBuffer = async () => {
    const offset = parseInt(nextOffset ? nextOffset : await fileService.read(), 10);
    logger.debug(`parsed offset from ${nextOffset ? 'memory' : 'control file'}`, { offset })
    if (offset < -1 || isNaN(offset)) {
        logger.error('invalid offset. please check the control file content');
        process.exit(-2);
    }
    buffer.push(...Array.from({ length: config.get('controlFile.bufferSize') }, (_, i) => i + offset + 1));
    nextOffset = buffer.at(-1).toString(10);
    await fileService.write(nextOffset);
    logger.debug('next offset saved to control file', { nextOffset, buffer })
}


module.exports = {
    nextId,
    fillBuffer
}