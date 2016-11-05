describe('Module', () => {
  beforeEach(function () {
    injector().inject((Module) => {
      this.Module = Module;
    });
  });

  it('should exist', function () {
    expect(this.Module).to.exist;
  });
});
