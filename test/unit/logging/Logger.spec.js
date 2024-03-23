describe('Logger', () => {
  let logSpy;

  beforeEach(() => {
    injector()
      .inject((Logger, console) => {
        this.Logger = Logger;

        logSpy = jest.spyOn(console, 'log').mockReturnThis();
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fatal()', () => {
    this.Logger.fatal('testing fatal');
    expect(logSpy.mock.lastCall).toEqual(['\u001b[31mLogger#fatal: \u001b[39m', 'testing fatal']);
  });

  it('should error()', () => {
    this.Logger.error('testing error');
    expect(logSpy.mock.lastCall).toEqual(['\u001b[31mLogger#error: \u001b[39m', 'testing error']);
  });

  it('should warn()', () => {
    this.Logger.warn('testing warn');
    expect(logSpy.mock.lastCall).toEqual(['\u001b[33mLogger#warn: \u001b[39m', 'testing warn']);
  });

  it('should info()', () => {
    this.Logger.info('testing info');
    expect(logSpy.mock.lastCall).toEqual(['\u001b[36mLogger#info: \u001b[39m', 'testing info']);
  });

  it('should log()', () => {
    this.Logger.log('testing log');
    expect(logSpy.mock.lastCall).toEqual(['\u001b[36mLogger#log: \u001b[39m', 'testing log']);
  });

  it('should debug()', () => {
    this.Logger.debug('testing debug');
    expect(logSpy.mock.lastCall).toEqual(['\u001b[36mLogger#debug: \u001b[39m', 'testing debug']);
  });

  it('should verbose()', () => {
    this.Logger.verbose('testing verbose');
    expect(logSpy.mock.lastCall).toEqual(['\u001b[36mLogger#verbose: \u001b[39m', 'testing verbose']);
  });
});
