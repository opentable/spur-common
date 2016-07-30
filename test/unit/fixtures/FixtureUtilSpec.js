describe('FixtureUtil', () => {
  beforeEach(function () {
    injector()
    .inject((FixtureUtil, FixtureCache, path, Logger) => {
      this.FixtureUtil = FixtureUtil;
      this.FixtureCache = FixtureCache;
      this.Logger = Logger;
      this.path = path;

      // Hide junk logging entries
      Logger.useRecorder();

      this.expectedFixturesPath = path.join(__dirname, '../../fixtures/data/');
    });
  });

  it('fixtures path is set', function () {
    this.FixtureUtil.setFixturesPath(this.expectedFixturesPath);
    expect(this.FixtureUtil.fixturesPath).to.equal(this.expectedFixturesPath);
  });

  it('should reject when fixtures path is not set', function () {
    expect(this.FixtureUtil.fixturesPath).to.equal(undefined);

    this.FixtureUtil.startFileRead('readFileTest')
    .error((reason) => {
      expect(reason.message).to.equal('fixtures path is not defined');
    });
  });

  it('should be able to read content from a data fixture file', function () {
    this.FixtureUtil.setFixturesPath(this.expectedFixturesPath);
    this.FixtureUtil.readAndProcessFile('readFileTest')
    .then((result) => {
      expect(result).to.deep.equal({
        what: 'test',
        year: 2015
      });
    });
  });

  it('should be able to read content from a data fixture file and cache', function () {
    this.FixtureUtil.setFixturesPath(this.expectedFixturesPath);
    this.FixtureUtil.get('readFileTest')
    .then((result) => {
      expect(result).to.deep.equal({
        what: 'test',
        year: 2015
      });
    });
  });

  it('should reject getting of the fixture file when file does not exist', function (done) {
    this.FixtureUtil.setFixturesPath(this.expectedFixturesPath);
    const missingPath = this.path.join(this.expectedFixturesPath, 'missingFileName.json');
    this.FixtureUtil.readAndProcessFile('missingFileName')
    .error((reason) => {
      expect(reason.message).to.equal(`${missingPath} not found`);
      done();
    });
  });

  it('should serialize a valid json string', function () {
    let expected = { firstProp: 'firstPropValue', complexProp: { secondProp: 'secondPropValue' } };
    expect(this.FixtureUtil.processText(JSON.stringify(expected, null, 2)))
      .to.deep.equal(expected);

    expected = {};
    expect(this.FixtureUtil.processText(null)).to.deep.equal(expected);
    expect(this.FixtureUtil.processText(undefined)).to.deep.equal(expected);
    expect(this.FixtureUtil.processText('')).to.deep.equal(expected);
  });
});
