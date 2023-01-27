const fileService = require("./file.service")
const fs = require('fs/promises')
const sinon = require("sinon")

describe('file service tests', () => {
    let readFileStub
    let writeFileStub
    let processStub

    beforeEach(() => {
        readFileStub = sinon.stub(fs, "readFile");
        writeFileStub = sinon.stub(fs, "writeFile");
        processStub = sinon.stub(process, 'exit');
        processStub.throwsArg(0)
    });

    afterEach(() => {
        readFileStub.restore();
        writeFileStub.restore();
        processStub.restore();
    });

    it(`should read a number from a control file`, async () => {
        readFileStub.resolves("1");
        expect(await fileService.read()).toEqual("1")
    });

    it(`should raise an error if the control file does not exist`, async () => {
        const error = { "code": "ENOENT" }
        readFileStub.throws(error);
        expect.assertions(1);
        await expect(fileService.read()).rejects.toEqual(-1);
    });

    it(`should write a number to a control file`, async () => {
        writeFileStub.resolves();
        await fileService.write("1");
        sinon.assert.calledWith(writeFileStub, "data/control.txt", "1");
    });
});