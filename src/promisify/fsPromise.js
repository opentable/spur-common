import fs from 'fs';

module.exports = function (Promise) {
  return Promise.promisifyAll(fs);
};
