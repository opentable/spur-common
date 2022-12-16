const spur = require('spur-ioc');
const coreLibs = require('../../src/injector');

module.exports = function () {
  const ioc = spur.create('test-spur-common');
  ioc.merge(coreLibs());

  return ioc;
}
