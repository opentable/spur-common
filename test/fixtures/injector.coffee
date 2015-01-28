spur = require "spur-ioc"
coreLibs = require "../../src/injector"

module.exports = ()->

  ioc = spur.create("test-spur-common")
  ioc.merge(coreLibs())

  ioc
