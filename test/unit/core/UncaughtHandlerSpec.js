describe('UncaughtHandler', () => {
  const base = this;

  beforeEach(function () {
    base.mockProcess = {
      on: (event, errorFn) => {
        base.event = event;
        base.errorFn = errorFn;
      },
      exit: (exitCode) => { base.exitCode = exitCode; }
    };

    const ioc = injector();

    ioc.addDependency('nodeProcess', base.mockProcess, true);
    ioc.inject(function (UncaughtHandler, Logger) {
      base.UncaughtHandler = UncaughtHandler;
      base.Logger = Logger;
      base.Logger.useRecorder();
    });
  });

  it('should exist', function () {
    expect(base.UncaughtHandler).to.exist;
  });

  it('should listen and process uncaughtException', function () {
    base.UncaughtHandler.listen();
    expect(base.event).to.equal('uncaughtException');

    base.errorFn(new Error('Oops!'));
    expect(base.Logger.recorded.error[0][0].message).to.equal('Oops!');
    expect(base.exitCode).to.equal(0);
  });
});
