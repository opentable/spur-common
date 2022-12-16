describe('Timer', function () {

  beforeEach(() => {
    injector().inject((Timer, nodeProcess) => {
      this.Timer = Timer;
      this.nodeProcess = nodeProcess;

      this.hrtimeStub = sinon.stub(this.nodeProcess, 'hrtime');
      this.hrtimeStub.onCall(0).returns([7973, 560332779]);
      this.hrtimeStub.onCall(1).returns([0, 1065832]);
    });
  });

  afterEach(() => {
    this.hrtimeStub.restore();
  });

  it('test timer', () => {
    const timer = new this.Timer().start();
    const duration = timer.stop();
    expect(duration).to.equal(1.066);
  });

  it('mockDuration()', () => {
    this.Timer.mockDuration(22);
    expect(new this.Timer().start().stop())
      .to.equal(22);
  });
});
