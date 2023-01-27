/** @type {import('jest').Config} */
const config = {
    verbose: true,
    collectCoverage: true,
    testPathIgnorePatterns: ["/node_modules/", "/config/"]
};

module.exports = config;