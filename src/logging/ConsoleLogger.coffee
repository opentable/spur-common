module.exports = (BaseDelegate)->

  new class ConsoleLogger extends BaseDelegate

    constructor: ()->

      @supportsMethods [
        "fatal"
        "error"
        "warn"
        "info"
        "log"
        "debug"
        "verbose"
      ]
