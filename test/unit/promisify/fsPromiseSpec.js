describe('fsPromise', () => {
  beforeEach(function () {
    injector().inject((fsPromise) => {
      this.fsPromise = fsPromise;
    });
  });

  it('should exist', function () {
    expect(this.fsPromise).to.exist;
    expect(this.fsPromise.exists).to.exist;
    expect(this.fsPromise.writeFileAsync).to.exist;
  });
});
