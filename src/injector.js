const spur = require('spur-ioc');

const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const SpurErrors = require('spur-errors');
const superagent = require('superagent');
const FormData = require('form-data');
const consoleColors = require('colors/safe');

function dependencyRegistration() {
  const ioc = spur.create('spur-common');

  ioc.registerDependencies({
    Promise,
    fs,
    path,
    SpurErrors,
    superagent,
    FormData,
    consoleColors,
    console,
    nodeProcess: process,
    JSON
  });

  ioc.registerFolders(__dirname, [
    'core',
    'fixtures',
    'http',
    'logging',
    'promisify',
    'utils'
  ]);

  return ioc;
}

module.exports = dependencyRegistration;
