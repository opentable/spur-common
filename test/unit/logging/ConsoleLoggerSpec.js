const _last = require('lodash.last');

describe('ConsoleLogger', () => {
  const base = this;

  beforeEach(function () {
    base.MockLogger = {
      log: sinon.stub()
    };

    injector()
      .addDependency('console', base.MockLogger, true)
      .inject(function (ConsoleLogger, console) {
        base.ConsoleLogger = ConsoleLogger;
        base.console = console;

        base.getResult = () => {
          return _last(base.console.log.getCalls()).args;
        };
      });
  });

  it('should fatal()', function () {
    base.ConsoleLogger.fatal('testing fatal');
    expect(base.getResult()).to.deep.equal(['\u001b[31mConsoleLogger#fatal: \u001b[39m', 'testing fatal']);
  });

  it('should error()', function () {
    base.ConsoleLogger.error('testing error');
    expect(base.getResult()).to.deep.equal(['\u001b[31mConsoleLogger#error: \u001b[39m', 'testing error']);
  });

  it('should warn()', function () {
    base.ConsoleLogger.warn('testing warn');
    expect(base.getResult()).to.deep.equal(['\u001b[33mConsoleLogger#warn: \u001b[39m', 'testing warn']);
  });

  it('should info()', function () {
    base.ConsoleLogger.info('testing info');
    expect(base.getResult()).to.deep.equal(['\u001b[36mConsoleLogger#info: \u001b[39m', 'testing info']);
  });

  it('should log()', function () {
    base.ConsoleLogger.log('testing log');
    expect(base.getResult()).to.deep.equal(['\u001b[36mConsoleLogger#log: \u001b[39m', 'testing log']);
  });

  it('should debug()', function () {
    base.ConsoleLogger.debug('testing debug');
    expect(base.getResult()).to.deep.equal(['\u001b[36mConsoleLogger#debug: \u001b[39m', 'testing debug']);
  });

  it('should verbose()', function () {
    base.ConsoleLogger.verbose('testing verbose');
    expect(base.getResult()).to.deep.equal(['\u001b[36mConsoleLogger#verbose: \u001b[39m', 'testing verbose']);
  });
});
