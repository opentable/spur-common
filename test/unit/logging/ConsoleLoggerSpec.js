describe('ConsoleLogger', () => {
  beforeEach(function () {
    this.MockLogger = {
      log: sinon.stub()
    };

    injector()
      .addDependency('console', this.MockLogger, true)
      .inject((ConsoleLogger, console, _) => {
        this.ConsoleLogger = ConsoleLogger;
        this.console = console;
        this._ = _;

        this.getResult = () => {
          return this._.last(this.console.log.getCalls()).args;
        };
      });
  });

  it('should fatal()', function () {
    this.ConsoleLogger.fatal('testing fatal');
    expect(this.getResult()).to.deep.equal(['\u001b[31mConsoleLogger#fatal: \u001b[39m', 'testing fatal']);
  });

  it('should error()', function () {
    this.ConsoleLogger.error('testing error');
    expect(this.getResult()).to.deep.equal(['\u001b[31mConsoleLogger#error: \u001b[39m', 'testing error']);
  });

  it('should warn()', function () {
    this.ConsoleLogger.warn('testing warn');
    expect(this.getResult()).to.deep.equal(['\u001b[33mConsoleLogger#warn: \u001b[39m', 'testing warn']);
  });

  it('should info()', function () {
    this.ConsoleLogger.info('testing info');
    expect(this.getResult()).to.deep.equal(['\u001b[36mConsoleLogger#info: \u001b[39m', 'testing info']);
  });

  it('should log()', function () {
    this.ConsoleLogger.log('testing log');
    expect(this.getResult()).to.deep.equal(['\u001b[36mConsoleLogger#log: \u001b[39m', 'testing log']);
  });

  it('should debug()', function () {
    this.ConsoleLogger.debug('testing debug');
    expect(this.getResult()).to.deep.equal(['\u001b[36mConsoleLogger#debug: \u001b[39m', 'testing debug']);
  });

  it('should verbose()', function () {
    this.ConsoleLogger.verbose('testing verbose');
    expect(this.getResult()).to.deep.equal(['\u001b[36mConsoleLogger#verbose: \u001b[39m', 'testing verbose']);
  });
});
