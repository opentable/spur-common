module.exports = (BaseDelegate, winston)->

  new class Logger extends BaseDelegate

    constructor:()->
      @supportsMethods [
        "fatal"
        "error"
        "warn"
        "info"
        "log"
        "debug"
        "verbose"
      ]

    #TODO: evaluate if this should be in common
    useWinston:()->
      winston.cli()
      @delegate = winston