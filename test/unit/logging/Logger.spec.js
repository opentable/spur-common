const _last = require('lodash.last');

describe('Logger', () => {

  beforeEach(() => {
    this.MockLogger = {
      log: sinon.stub()
    };

    injector()
      .addDependency('console', this.MockLogger, true)
      .inject((Logger, console) => {
        this.Logger = Logger;
        this.console = console;

        this.getResult = () => {
          return _last(this.console.log.getCalls()).args;
        };
      });
  });

  it('should fatal()', () => {
    this.Logger.fatal('testing fatal');
    expect(this.getResult()).to.deep.equal(['\u001b[31mLogger#fatal: \u001b[39m', 'testing fatal']);
  });

  it('should error()', () => {
    this.Logger.error('testing error');
    expect(this.getResult()).to.deep.equal(['\u001b[31mLogger#error: \u001b[39m', 'testing error']);
  });

  it('should warn()', () => {
    this.Logger.warn('testing warn');
    expect(this.getResult()).to.deep.equal(['\u001b[33mLogger#warn: \u001b[39m', 'testing warn']);
  });

  it('should info()', () => {
    this.Logger.info('testing info');
    expect(this.getResult()).to.deep.equal(['\u001b[36mLogger#info: \u001b[39m', 'testing info']);
  });

  it('should log()', () => {
    this.Logger.log('testing log');
    expect(this.getResult()).to.deep.equal(['\u001b[36mLogger#log: \u001b[39m', 'testing log']);
  });

  it('should debug()', () => {
    this.Logger.debug('testing debug');
    expect(this.getResult()).to.deep.equal(['\u001b[36mLogger#debug: \u001b[39m', 'testing debug']);
  });

  it('should verbose()', () => {
    this.Logger.verbose('testing verbose');
    expect(this.getResult()).to.deep.equal(['\u001b[36mLogger#verbose: \u001b[39m', 'testing verbose']);
  });
});
