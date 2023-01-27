const request = require("supertest");
const fs = require('fs/promises');
const sinon = require("sinon")

describe("Test the root path", () => {
    let readFileStub
    let writeFileStub

    beforeEach(() => {
        jest.resetModules()
        readFileStub = sinon.stub(fs, "readFile");
        readFileStub.resolves("-1");
        writeFileStub = sinon.stub(fs, "writeFile");
    });

    afterEach(() => {
        readFileStub.restore();
        writeFileStub.restore();
    });

    it("should produce one new id", async () => {
        const app = require("./app");
        const response = await request(app).post("/");
        expect(response.statusCode).toBe(201);
        expect(response.body.id).toMatch(/[A-Z0-9]{7}/);
    });
    it("should produce multiple new ids", async () => {
        const app = require("./app");
        const response = await request(app).post("/?n=2");
        expect(response.statusCode).toBe(201);
        expect(response.body.length).toBe(2);
        expect(response.body[0].id).toMatch(/[A-Z0-9]{7}/);
        expect(response.body[1].id).toMatch(/[A-Z0-9]{7}/);
        expect(response.body[0].id).not.toEqual(response.body[1].id);
    });
    it("should have a health endpoint", async () => {
        const app = require("./app");
        const response = await request(app).get("/health");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("UP");
    });
    it("should have an unhealthy endpoint if the instance runs out of unused IDs", async () => {
        readFileStub.resolves("1073741822");
        const app = require("./app");
        expect((await request(app).post("/")).statusCode).toBe(201);
        expect((await request(app).get("/health")).statusCode).toBe(200);
        expect((await request(app).post("/")).statusCode).toBe(500);
        const response = await request(app).get("/health");
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe("DOWN");
    });
});