describe('DateTimeUtils', () => {
  beforeEach(function () {
    this.clock = sinon.useFakeTimers();
    injector().inject((DateTimeUtils, moment) => {
      this.DateTimeUtils = DateTimeUtils;
      this.moment = moment;
    });
  });

  afterEach(function () {
    this.clock.restore();
  });

  it('now()', function () {
    expect(this.DateTimeUtils.now())
      .to.deep.equal(this.moment());
  });

  it('nowMs()', function () {
    expect(this.DateTimeUtils.nowMs()).to.equal(+new Date());
  });
});
