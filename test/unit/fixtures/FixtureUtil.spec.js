describe('FixtureUtil', function () {

  beforeEach(() => {
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

  it('fixtures path is set', () => {
    this.FixtureUtil.setFixturesPath(this.expectedFixturesPath);
    expect(this.FixtureUtil.fixturesPath).toBe(this.expectedFixturesPath);
  });

  it('should reject when fixtures path is not set', () => {
    expect(this.FixtureUtil.fixturesPath).toBeUndefined();

    return this.FixtureUtil.startFileRead('readFileTest')
    .catch((reason) => {
      expect(reason.message).toBe('fixtures path is not defined');
    });
  });

  it('should be able to read content from a data fixture file', () => {
    this.FixtureUtil.setFixturesPath(this.expectedFixturesPath);

    return this.FixtureUtil.readAndProcessFile('readFileTest')
    .then((result) => {
      expect(result).toEqual({
        what: 'test',
        year: 2015
      });
    });
  });

  it('should be able to read content from a data fixture file and cache', () => {
    this.FixtureUtil.setFixturesPath(this.expectedFixturesPath);
    return this.FixtureUtil.get('readFileTest')
    .then((result) => {
      expect(result).toEqual({
        what: 'test',
        year: 2015
      });
    });
  });

  it('should reject getting of the fixture file when file does not exist', () => {
    this.FixtureUtil.setFixturesPath(this.expectedFixturesPath);
    const missingPath = this.path.join(this.expectedFixturesPath, 'missingFileName.json');
    return this.FixtureUtil.readAndProcessFile('missingFileName')
    .catch((reason) => {
      expect(reason.message).toBe(`${missingPath} not found`);
    });
  });

  it('should serialize a valid json string', () => {
    let expected = { firstProp: 'firstPropValue', complexProp: { secondProp: 'secondPropValue' } };
    expect(this.FixtureUtil.processText(JSON.stringify(expected, null, 2)))
      .toEqual(expected);

    expected = {};
    expect(this.FixtureUtil.processText(null)).toEqual(expected);
    expect(this.FixtureUtil.processText(undefined)).toEqual(expected);
    expect(this.FixtureUtil.processText('')).toEqual(expected);
  });
});
