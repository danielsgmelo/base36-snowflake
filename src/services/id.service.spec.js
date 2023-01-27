const fs = require('fs/promises')
const sinon = require("sinon")
const R = require("ramda")

describe('id service tests', () => {
    let readFileStub
    let writeFileStub
    let processStub
    let config

    beforeEach(() => {
        config = require("../../config/default")
        jest.resetModules()
        readFileStub = sinon.stub(fs, "readFile");
        readFileStub.resolves("-1");
        writeFileStub = sinon.stub(fs, "writeFile");
        processStub = sinon.stub(process, 'exit');
        processStub.throwsArg(0)
    });

    afterEach(() => {
        readFileStub.restore();
        writeFileStub.restore();
        processStub.restore();
    });

    it(`should generate one new id`, async () => {
        const idService = require("./id.service")

        expect(await idService.nextId()).toEqual({ id: "0000000" })
    });

    it(`should generate multiple ids in a sequential & predictable manner`, async () => {
        const idService = require("./id.service")

        expect(await idService.nextId()).toEqual({ id: "0000000" })
        expect(await idService.nextId()).toEqual({ id: "0000001" })
        expect(await idService.nextId()).toEqual({ id: "0000002" })
        expect(await idService.nextId()).toEqual({ id: "0000003" })
        expect(await idService.nextId()).toEqual({ id: "0000004" })
    });

    it(`should generate different IDs in different instances of the service`, async () => {
        jest.doMock('../../config/default', () => (R.mergeDeepRight(config, {
            instance: {
                id: 10,
            }
        })));
        const idService = require("./id.service")

        expect(await idService.nextId()).toEqual({ id: "4XKS4XS" })
        expect(await idService.nextId()).toEqual({ id: "4XKS4XT" })
        expect(await idService.nextId()).toEqual({ id: "4XKS4XU" })
    });

    it(`should refuse to generate new Ids if the sequential number has reached its max`, async () => {
        readFileStub.resolves("1073741820");
        const idService = require("./id.service")

        expect.assertions(6);
        expect(await idService.nextId()).toEqual({ id: "5FC25FH" })
        expect(await idService.nextId()).toEqual({ id: "5FC25FI" })
        expect(await idService.nextId()).toEqual({ id: "5FC25FJ" })
        await expect(idService.nextId()).rejects.toThrow('we ran out of unique IDs!')
        await expect(idService.nextId()).rejects.toThrow('we ran out of unique IDs!')
        await expect(idService.nextId()).rejects.toThrow('we ran out of unique IDs!')
    });

    it(`should refuse to generate an id if the control file's content is invalid`, async () => {
        readFileStub.resolves("🐈");
        const idService = require("./id.service")
        expect.assertions(1);
        await expect(idService.nextId()).rejects.toEqual(-2)
    });


    it(`should generate an id of a different size depending on the desired total bits setting`, async () => {
        jest.doMock('../../config/default', () => (R.mergeDeepRight(config, {
            id: {
                totalBits: 64,
                instanceBits: 14,
            }
        })));
        readFileStub.resolves((Math.pow(2, 50) - 2).toString());
        const idService = require("./id.service")

        expect.assertions(2);
        expect(await idService.nextId()).toEqual({ id: "003DY2W1L9CE8" })
        await expect(idService.nextId()).rejects.toThrow('we ran out of unique IDs!')
    });
});