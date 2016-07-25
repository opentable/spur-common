describe('UncaughtHandler', () => {
  beforeEach(function () {
    this.mockProcess = {
      on: (event, errorFn) => {
        this.event = event;
        this.errorFn = errorFn;
      },
      exit: (exitCode) => { this.exitCode = exitCode; }
    };

    const ioc = injector();
    ioc.addDependency('nodeProcess', this.mockProcess, true);
    ioc.inject((UncaughtHandler, Logger) => {
      this.UncaughtHandler = UncaughtHandler;
      this.Logger = Logger;
      this.Logger.useRecorder();
    });
  });

  it('should exist', function () {
    expect(this.UncaughtHandler).to.exist;
  });

  it('should listen and process uncaughtException', function () {
    this.UncaughtHandler.listen();
    expect(this.event).to.equal('uncaughtException');

    this.errorFn(new Error('Oops!'));
    expect(this.Logger.recorded.error[0][0].message).to.equal('Oops!');
    expect(this.exitCode).to.equal(0);
  });
});
