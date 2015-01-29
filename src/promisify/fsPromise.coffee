fs = require "fs"

module.exports = (Promise)->

  Promise.promisifyAll(fs)
