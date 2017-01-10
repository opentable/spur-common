module.exports = function (BaseDelegate) {
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
  }

  return new Logger();
};
