describe('ConsoleLogger', function () {
  let logSpy;

  beforeEach(() => {
    injector()
      .inject((ConsoleLogger, console) => {
        this.ConsoleLogger = ConsoleLogger;

        logSpy = jest.spyOn(console, 'log');
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fatal()', () => {
    this.ConsoleLogger.fatal('testing fatal');
    expect(logSpy.mock.lastCall).toEqual(['\u001b[31mConsoleLogger#fatal: \u001b[39m', 'testing fatal']);
  });

  it('should error()', () => {
    this.ConsoleLogger.error('testing error');
    expect(logSpy.mock.lastCall).toEqual(['\u001b[31mConsoleLogger#error: \u001b[39m', 'testing error']);
  });

  it('should warn()', () => {
    this.ConsoleLogger.warn('testing warn');
    expect(logSpy.mock.lastCall).toEqual(['\u001b[33mConsoleLogger#warn: \u001b[39m', 'testing warn']);
  });

  it('should info()', () => {
    this.ConsoleLogger.info('testing info');
    expect(logSpy.mock.lastCall).toEqual(['\u001b[36mConsoleLogger#info: \u001b[39m', 'testing info']);
  });

  it('should log()', () => {
    this.ConsoleLogger.log('testing log');
    expect(logSpy.mock.lastCall).toEqual(['\u001b[36mConsoleLogger#log: \u001b[39m', 'testing log']);
  });

  it('should debug()', () => {
    this.ConsoleLogger.debug('testing debug');
    expect(logSpy.mock.lastCall).toEqual(['\u001b[36mConsoleLogger#debug: \u001b[39m', 'testing debug']);
  });

  it('should verbose()', () => {
    this.ConsoleLogger.verbose('testing verbose');
    expect(logSpy.mock.lastCall).toEqual(['\u001b[36mConsoleLogger#verbose: \u001b[39m', 'testing verbose']);
  });
});
