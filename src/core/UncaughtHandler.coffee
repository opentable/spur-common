module.exports = (nodeProcess, Logger)->

  new class UncaughtHlander

    listen:()->
      nodeProcess.on 'uncaughtException', (err)->
        Logger.error(err)
        nodeProcess.exit(0)
