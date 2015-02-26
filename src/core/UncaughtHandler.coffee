module.exports = (nodeProcess, Logger)->

  new class UncaughtHlander

    listen:()->
      nodeProcess.on 'uncaughtException', (err)->
        Logger.error(err)
        Logger.error(err.stack)
        nodeProcess.exit(0)
