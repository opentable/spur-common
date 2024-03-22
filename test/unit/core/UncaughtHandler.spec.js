describe('UncaughtHandler', function () {

  beforeEach(() => {
    this.mockProcess = {
      on: (event, errorFn) => {
        this.event = event;
        this.errorFn = errorFn;
      },
      exit: (exitCode) => { this.exitCode = exitCode; }
    };

    injector()
      .addDependency('nodeProcess', this.mockProcess, true)
      .inject((UncaughtHandler, Logger) => {
        this.UncaughtHandler = UncaughtHandler;
        this.Logger = Logger;
        this.Logger.useRecorder();
      });
  });

  it('should listen and process uncaughtException', () => {
    this.UncaughtHandler.listen();
    expect(this.event).toBe('uncaughtException');

    this.errorFn(new Error('Oops!'));
    expect(this.Logger.recorded.error[0][0].message).toBe('Oops!');
    expect(this.exitCode).toBe(0);
  });
});
