module.exports = {
    id: {
        totalBits: 36,
        instanceBits: 6,
    },
    maxIdsPerRequest: 10,
    instance: {
        id: 0,
    },
    controlFile: {
        path: 'data/control.txt',
        bufferSize: 10
    },
    logLevel: 'debug',
    port: 5678
}