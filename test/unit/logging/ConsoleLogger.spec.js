describe('ConsoleLogger', function () {
  let logSpy;

  beforeEach(() => {
    injector()
      .inject((ConsoleLogger, console) => {
        this.ConsoleLogger = ConsoleLogger;

        logSpy = jest.spyOn(console, 'log').mockReturnThis();
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fatal()', () => {
    this.ConsoleLogger.fatal('testing fatal');
    expect(logSpy.mock.lastCall).toEqual(['ConsoleLogger#fatal: ', 'testing fatal']);
  });

  it('should error()', () => {
    this.ConsoleLogger.error('testing error');
    expect(logSpy.mock.lastCall).toEqual(['ConsoleLogger#error: ', 'testing error']);
  });

  it('should warn()', () => {
    this.ConsoleLogger.warn('testing warn');
    expect(logSpy.mock.lastCall).toEqual(['ConsoleLogger#warn: ', 'testing warn']);
  });

  it('should info()', () => {
    this.ConsoleLogger.info('testing info');
    expect(logSpy.mock.lastCall).toEqual(['ConsoleLogger#info: ', 'testing info']);
  });

  it('should log()', () => {
    this.ConsoleLogger.log('testing log');
    expect(logSpy.mock.lastCall).toEqual(['ConsoleLogger#log: ', 'testing log']);
  });

  it('should debug()', () => {
    this.ConsoleLogger.debug('testing debug');
    expect(logSpy.mock.lastCall).toEqual(['ConsoleLogger#debug: ', 'testing debug']);
  });

  it('should verbose()', () => {
    this.ConsoleLogger.verbose('testing verbose');
    expect(logSpy.mock.lastCall).toEqual(['ConsoleLogger#verbose: ', 'testing verbose']);
  });
});
