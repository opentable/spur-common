module.exports = function (BaseDelegate, winston) {
  class Logger extends BaseDelegate {

    constructor() {
      super();

      this.supportsMethods([
        'fatal',
        'error',
        'warn',
        'info',
        'log',
        'debug',
        'verbose'
      ]);
    }

    // TODO: evaluate if this should be in common
    useWinston() {
      winston.cli();
      this.use(winston);
    }

  }

  return new Logger();
};
