const healthService = require("./health.service")

describe('health service tests', () => {
    it(`should be healthy by default`, async () => {
        expect(healthService.getHealth()).toEqual(true)
    });

    it(`should be able to turn unhealthy`, async () => {
        expect(healthService.getHealth()).toEqual(true)
        healthService.setHealth(false)
        expect(healthService.getHealth()).toEqual(false)
    });
});