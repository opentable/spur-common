const path = require('path');

module.exports = async () => {
  const injector = require('./fixtures/injector');
  const testServer = require(path.join(__dirname, 'fixtures', 'server.js'));

  global.injector = injector;
  global.testServer = testServer;

  process.env.NODE_ENV = 'test';
};
