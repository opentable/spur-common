describe('fsPromise', function () {

  beforeEach(() => {
    injector().inject((fsPromise) => {
      this.fsPromise = fsPromise;
    });
  });

  it('should exist', () => {
    expect(this.fsPromise).toBeDefined();
    expect(this.fsPromise.exists).toBeDefined();
    expect(this.fsPromise.writeFileAsync).toBeDefined();
  });
});
