describe('FixtureUtil', () => {
  const base = this;

  beforeEach(function () {
    injector()
    .inject(function (FixtureUtil, FixtureCache, path, Logger) {
      base.FixtureUtil = FixtureUtil;
      base.FixtureCache = FixtureCache;
      base.Logger = Logger;
      base.path = path;

      // Hide junk logging entries
      Logger.useRecorder();

      base.expectedFixturesPath = path.join(__dirname, '../../fixtures/data/');
    });
  });

  it('fixtures path is set', function () {
    base.FixtureUtil.setFixturesPath(base.expectedFixturesPath);
    expect(base.FixtureUtil.fixturesPath).to.equal(base.expectedFixturesPath);
  });

  it('should reject when fixtures path is not set', function () {
    expect(base.FixtureUtil.fixturesPath).to.equal(undefined);

    return base.FixtureUtil.startFileRead('readFileTest')
    .catch((reason) => {
      expect(reason.message).to.equal('fixtures path is not defined');
    });
  });

  it('should be able to read content from a data fixture file', function () {
    base.FixtureUtil.setFixturesPath(base.expectedFixturesPath);

    return base.FixtureUtil.readAndProcessFile('readFileTest')
    .then((result) => {
      expect(result).to.deep.equal({
        what: 'test',
        year: 2015
      });
    });
  });

  it('should be able to read content from a data fixture file and cache', function () {
    base.FixtureUtil.setFixturesPath(base.expectedFixturesPath);
    return base.FixtureUtil.get('readFileTest')
    .then((result) => {
      expect(result).to.deep.equal({
        what: 'test',
        year: 2015
      });
    });
  });

  it('should reject getting of the fixture file when file does not exist', function () {
    base.FixtureUtil.setFixturesPath(base.expectedFixturesPath);
    const missingPath = base.path.join(base.expectedFixturesPath, 'missingFileName.json');
    return base.FixtureUtil.readAndProcessFile('missingFileName')
    .catch((reason) => {
      expect(reason.message).to.equal(`${missingPath} not found`);
    });
  });

  it('should serialize a valid json string', function () {
    let expected = { firstProp: 'firstPropValue', complexProp: { secondProp: 'secondPropValue' } };
    expect(base.FixtureUtil.processText(JSON.stringify(expected, null, 2)))
      .to.deep.equal(expected);

    expected = {};
    expect(base.FixtureUtil.processText(null)).to.deep.equal(expected);
    expect(base.FixtureUtil.processText(undefined)).to.deep.equal(expected);
    expect(base.FixtureUtil.processText('')).to.deep.equal(expected);
  });
});
