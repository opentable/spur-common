describe('Logger', () => {
  beforeEach(function () {
    this.MockLogger = {
      log: sinon.stub()
    };

    injector()
      .addDependency('console', this.MockLogger, true)
      .inject((Logger, console, _) => {
        this.Logger = Logger;
        this.console = console;
        this._ = _;

        this.getResult = () => {
          return this._.last(this.console.log.getCalls()).args;
        };
      });
  });

  it('should use winston as it\'s logger', function () {
    sinon.spy(this.Logger, 'use');
    this.Logger.useWinston();
    expect(this.Logger.use.getCalls().length).to.equal(1);
    expect(this.Logger.use.getCall(0).args[0].transports).to.exist;
  });

  it('should fatal()', function () {
    this.Logger.fatal('testing fatal');
    expect(this.getResult()).to.deep.equal(['\u001b[31mLogger#fatal: \u001b[39m', 'testing fatal']);
  });

  it('should error()', function () {
    this.Logger.error('testing error');
    expect(this.getResult()).to.deep.equal(['\u001b[31mLogger#error: \u001b[39m', 'testing error']);
  });

  it('should warn()', function () {
    this.Logger.warn('testing warn');
    expect(this.getResult()).to.deep.equal(['\u001b[33mLogger#warn: \u001b[39m', 'testing warn']);
  });

  it('should info()', function () {
    this.Logger.info('testing info');
    expect(this.getResult()).to.deep.equal(['\u001b[36mLogger#info: \u001b[39m', 'testing info']);
  });

  it('should log()', function () {
    this.Logger.log('testing log');
    expect(this.getResult()).to.deep.equal(['\u001b[36mLogger#log: \u001b[39m', 'testing log']);
  });

  it('should debug()', function () {
    this.Logger.debug('testing debug');
    expect(this.getResult()).to.deep.equal(['\u001b[36mLogger#debug: \u001b[39m', 'testing debug']);
  });

  it('should verbose()', function () {
    this.Logger.verbose('testing verbose');
    expect(this.getResult()).to.deep.equal(['\u001b[36mLogger#verbose: \u001b[39m', 'testing verbose']);
  });
});
