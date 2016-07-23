module.exports = function (nodeProcess, Logger) {
  class UncaughtHandler {

    listen() {
      nodeProcess.on('uncaughtException', (err) => {
        Logger.error(err);
        Logger.error(err.stack);
        nodeProcess.exit(0);
      });
    }

  }

  return new UncaughtHandler();
};
