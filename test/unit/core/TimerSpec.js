describe('Timer', () => {
  const base = this;

  beforeEach(function () {
    injector().inject(function (Timer, nodeProcess) {
      base.Timer = Timer;
      base.nodeProcess = nodeProcess;

      base.hrtimeStub = sinon.stub(base.nodeProcess, 'hrtime');
      base.hrtimeStub.onCall(0).returns([7973, 560332779]);
      base.hrtimeStub.onCall(1).returns([0, 1065832]);
    });
  });

  afterEach(function () {
    base.hrtimeStub.restore();
  });

  it('test timer', function () {
    const timer = new base.Timer().start();
    const duration = timer.stop();
    expect(duration).to.equal(1.066);
  });

  it('mockDuration()', function () {
    base.Timer.mockDuration(22);
    expect(new base.Timer().start().stop())
      .to.equal(22);
  });
});
