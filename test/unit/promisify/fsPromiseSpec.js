describe('fsPromise', () => {
  const base = this;

  beforeEach(() => {
    injector().inject(function (fsPromise) {
      base.fsPromise = fsPromise;
    });
  });

  it('should exist', function () {
    expect(base.fsPromise).to.exist;
    expect(base.fsPromise.exists).to.exist;
    expect(base.fsPromise.writeFileAsync).to.exist;
  });
});
