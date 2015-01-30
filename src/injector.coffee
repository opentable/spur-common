spur = require "spur-ioc"
path = require "path"

module.exports = ()->

  ioc = spur.create("spur-common")

  ioc.registerDependencies {
    "_"               : require "lodash"
    "Promise"         : require "bluebird"
    "fs"              : require "fs"
    "path"            : require "path"
    "SpurErrors"      : require "spur-errors"
    "winston"         : require "winston"
    "moment"          : require "moment-timezone"
    "superagent"      : require "superagent"

    "console"         : console
    "nodeProcess"     : process
  }

  ioc.registerFolders __dirname, [
    "core"
    "fixtures"
    "http"
    "logging"
    "promisify"
    "utils"
  ]

  ioc
