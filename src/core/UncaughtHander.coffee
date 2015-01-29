module.exports = (nodeProcess, Logger)->

  new class UncaughtHander

    listen:()->
      nodeProcess.on 'uncaughtException', (err)->
        Logger.info(err)
        nodeProcess.exit(0)
