describe('Timer', function () {

  beforeEach(() => {
    injector().inject((Timer, nodeProcess) => {
      this.Timer = Timer;
      this.nodeProcess = nodeProcess;

      this.hrtimeStub =  jest.spyOn(this.nodeProcess, 'hrtime');

      this.hrtimeStub
        .mockReturnValueOnce([7973, 560332779]) // First call
        .mockReturnValueOnce([0, 1065832]); // Second call
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('test timer', () => {
    const timer = new this.Timer().start();
    const duration = timer.stop();
    expect(duration).toBe(1.066);
  });

  it('mockDuration()', () => {
    this.Timer.mockDuration(22);
    expect(new this.Timer().start().stop())
      .toBe(22);
  });
});
