const spur = require('spur-ioc');

// Resolvable dependencies
const _ = require('lodash');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const SpurErrors = require('spur-errors');
const moment = require('moment-timezone');
const superagent = require('superagent');
const FormData = require('form-data');
const consoleColors = require('colors/safe');

function dependencyRegistration() {
  const ioc = spur.create('spur-common');

  ioc.registerDependencies({
    _,
    Promise,
    fs,
    path,
    SpurErrors,
    moment,
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
