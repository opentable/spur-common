describe('Module', () => {
  const base = this;

  beforeEach(function () {
    injector().inject(function (Module) {
      base.Module = Module;
    });
  });

  it('should exist', function () {
    expect(base.Module).to.exist;
  });
});
