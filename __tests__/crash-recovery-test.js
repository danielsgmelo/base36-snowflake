const { spawn } = require('node:child_process');
const fileService = require("../src/services/file.service");
const { logger } = require("../src/logger");
const request = require("supertest")('http://localhost:5678');

const startServer = () => new Promise((resolve, reject) => {
    logger.info("starting server")
    const server = spawn('node', ['src/server.js']);
    server.stdout.on('data', (data) => {
        if (data.includes("app listening on port 5678")) {
            logger.info("server started!")
            resolve(server);
        }
    });
    server.stderr.on('data', (data) => {
        reject(`error: ${data}`)
    });
    server.on('close', (code) => {
        reject(`child process exited with code ${code}`)
    });
})

const getOneIdAndKillServer = async () => {
    const server = await startServer();

    const id = await request.post('/');
    logger.info('got an id', { id: id.body.id })

    server.kill('SIGKILL')
    logger.info("server killed")
    return id.body.id
}

describe('server crash & recovery test', () => {
    beforeAll(async () => {
        logger.info("intializing control file")
        await fileService.write("-1");
    });
    it('should recover from crashes without reusing IDs', async () => {
        expect(await getOneIdAndKillServer()).toEqual("0000000")
        expect(await getOneIdAndKillServer()).toEqual("000000A")
    });
});
