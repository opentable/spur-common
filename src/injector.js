import spur from 'spur-ioc';

// Resolvable dependencies
import _ from 'lodash';
import Promise from 'bluebird';
import fs from 'fs';
import path from 'path';
import SpurErrors from 'spur-errors';
import winston from 'winston';
import moment from 'moment-timezone';
import superagent from 'superagent';
import FormData from 'form-data';
import consoleColors from 'colors/safe';

function dependencyRegistration() {
  const ioc = spur.create('spur-common');

  ioc.registerDependencies({
    _,
    Promise,
    fs,
    path,
    SpurErrors,
    winston,
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

export default dependencyRegistration;
