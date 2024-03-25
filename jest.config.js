module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    './src/**/*.js?(x)'
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  moduleFileExtensions: [
    'js',
    'json'
  ],
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.js?(x)',
    '**/?(*.)+(spec).js?(x)'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  setupFiles: ['./test/testSetup.js'],
};
