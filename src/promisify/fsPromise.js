const fs = require('fs');

module.exports = function (Promise) {
  return Promise.promisifyAll(fs);
};
