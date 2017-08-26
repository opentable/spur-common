describe('Logger', () => {
  const base = this;

  beforeEach(function () {
    base.MockLogger = {
      log: sinon.stub()
    };

    injector()
      .addDependency('console', base.MockLogger, true)
      .inject(function (Logger, console, _) {
        base.Logger = Logger;
        base.console = console;
        base._ = _;

        base.getResult = () => {
          return base._.last(base.console.log.getCalls()).args;
        };
      });
  });

  it('should fatal()', function () {
    base.Logger.fatal('testing fatal');
    expect(base.getResult()).to.deep.equal(['\u001b[31mLogger#fatal: \u001b[39m', 'testing fatal']);
  });

  it('should error()', function () {
    base.Logger.error('testing error');
    expect(base.getResult()).to.deep.equal(['\u001b[31mLogger#error: \u001b[39m', 'testing error']);
  });

  it('should warn()', function () {
    base.Logger.warn('testing warn');
    expect(base.getResult()).to.deep.equal(['\u001b[33mLogger#warn: \u001b[39m', 'testing warn']);
  });

  it('should info()', function () {
    base.Logger.info('testing info');
    expect(base.getResult()).to.deep.equal(['\u001b[36mLogger#info: \u001b[39m', 'testing info']);
  });

  it('should log()', function () {
    base.Logger.log('testing log');
    expect(base.getResult()).to.deep.equal(['\u001b[36mLogger#log: \u001b[39m', 'testing log']);
  });

  it('should debug()', function () {
    base.Logger.debug('testing debug');
    expect(base.getResult()).to.deep.equal(['\u001b[36mLogger#debug: \u001b[39m', 'testing debug']);
  });

  it('should verbose()', function () {
    base.Logger.verbose('testing verbose');
    expect(base.getResult()).to.deep.equal(['\u001b[36mLogger#verbose: \u001b[39m', 'testing verbose']);
  });
});
