const R = require("ramda")
const { configSchema } = require("./schema");

describe('instance id config tests', () => {
    beforeEach(() => {
        jest.resetModules()
    });

    it(`should accept an instance id within the range of the instanceBits config`, async () => {
        const config = R.mergeDeepRight(require("../config/default"), {
            id: {
                instanceBits: 2
            },
            instance: {
                id: 3
            }
        });
        expect.assertions(1);
        await expect(configSchema.validateAsync(config)).resolves.toEqual(config);
    });

    it(`should refuse an instance id outside the range of the instanceBits config`, async () => {
        const config = R.mergeDeepRight(require("../config/default"), {
            id: {
                instanceBits: 2
            },
            instance: {
                id: 4
            }
        });
        expect.assertions(1);
        await expect(configSchema.validateAsync(config)).rejects.toThrow("\"instance.id\" must be less than or equal to 3")
    });

});