module.exports = function (BaseDelegate) {
  class ConsoleLogger extends BaseDelegate {

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

  }

  return new ConsoleLogger();
};
