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
    expect(logSpy.mock.lastCall).toEqual(['Logger#fatal: ', 'testing fatal']);
  });

  it('should error()', () => {
    this.Logger.error('testing error');
    expect(logSpy.mock.lastCall).toEqual(['Logger#error: ', 'testing error']);
  });

  it('should warn()', () => {
    this.Logger.warn('testing warn');
    expect(logSpy.mock.lastCall).toEqual(['Logger#warn: ', 'testing warn']);
  });

  it('should info()', () => {
    this.Logger.info('testing info');
    expect(logSpy.mock.lastCall).toEqual(['Logger#info: ', 'testing info']);
  });

  it('should log()', () => {
    this.Logger.log('testing log');
    expect(logSpy.mock.lastCall).toEqual(['Logger#log: ', 'testing log']);
  });

  it('should debug()', () => {
    this.Logger.debug('testing debug');
    expect(logSpy.mock.lastCall).toEqual(['Logger#debug: ', 'testing debug']);
  });

  it('should verbose()', () => {
    this.Logger.verbose('testing verbose');
    expect(logSpy.mock.lastCall).toEqual(['Logger#verbose: ', 'testing verbose']);
  });
});
