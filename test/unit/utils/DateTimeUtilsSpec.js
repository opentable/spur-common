describe('DateTimeUtils', () => {
  const base = this;

  beforeEach(function () {
    base.clock = sinon.useFakeTimers();
    injector().inject(function (DateTimeUtils, moment) {
      base.DateTimeUtils = DateTimeUtils;
      base.moment = moment;
    });
  });

  afterEach(function () {
    base.clock.restore();
  });

  it('now()', function () {
    expect(base.DateTimeUtils.now())
      .to.deep.equal(base.moment());
  });

  it('nowMs()', function () {
    expect(base.DateTimeUtils.nowMs()).to.equal(+new Date());
  });
});
