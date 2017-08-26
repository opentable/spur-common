const path = require('path');

global.assert = require('assert');
global.sinon = require('sinon');
global.chai = require('chai');
global.expect = global.chai.expect;
global.nock = require('nock');

global.srcDir = path.resolve(__dirname, '../src');
global.injector = require(path.join(__dirname, 'fixtures', 'injector.js'));
global.testServer = require(path.join(__dirname, 'fixtures', 'server.js'));

process.env.NODE_ENV = 'test';

process.setMaxListeners(1000);
