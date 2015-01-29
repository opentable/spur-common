spur = require "spur-ioc"
path = require "path"

module.exports = ()->

  ioc = spur.create("spur-common")

  ioc.registerLibraries {
    "_"               : "lodash"
    "Promise"         : "bluebird"
    "fs"              : "fs"
    "path"            : "path"
    "SpurErrors"      : "spur-errors"
    "winston"         : "winston"
    "moment"          : "moment"
    "superagent"      : "superagent"
  }

  ioc.registerDependencies {
    "console"         : console
    "nodeProcess"     : process
  }

  ioc.registerFolders __dirname, [
    "core"
    "http"
    "promisify"
    "utils"
  ]

  ioc
