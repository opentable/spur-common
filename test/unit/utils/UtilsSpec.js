describe('Utils', () => {
  const base = this;

  beforeEach(function () {
    injector().inject(function (Utils, Promise, path) {
      base.Utils = Utils;
      base.Promise = Promise;
      base.path = path;
    });
  });

  it('prop()', function () {
    const ob = { k: 'v' };
    const fn = base.Utils.prop('k');
    expect(fn(ob)).to.equal('v');
  });

  it('extendWith', function () {
    const obToExtend = { a: 'a' };
    const obToExtendWith = { b: 'b' };
    const fn = base.Utils.extendWith(obToExtendWith);
    fn(obToExtend);
    expect(obToExtend).to.deep.equal({
      a: 'a', b: 'b'
    });
  });

  it('capitalize()', function () {
    expect(base.Utils.capitalize('foo')).to.equal('Foo');
  });

  it('identity()', function () {
    const fn = base.Utils.identity(2);
    expect(fn()).to.equal(2);
  });

  it('mapObject', function () {
    const ob = {
      one: 1,
      two: 2
    };
    const timesTwo = (n) => n + n;
    const newOb = base.Utils.mapObject(ob, timesTwo);
    expect(newOb).not.to.equal(ob);
    expect(newOb).to.deep.equal({
      one: 2,
      two: 4
    });
  });

  it('deepClone()', function () {
    const ob = { name: 'hi' };
    const ob2 = base.Utils.deepClone(ob);
    expect(ob).not.to.equal(ob2);
    expect(ob).to.deep.equal(ob2);
  });

  it('promiseQueue()', function (done) {
    let str = '';
    const delay = (ms, val) => {
      return () => {
        return base.Promise.delay(ms)
        .then(() => {
          str += val;
          return str;
        });
      };
    };

    base.Utils.promiseQueue([
      delay(5, 1),
      delay(4, 2),
      delay(3, 3),
      delay(2, 4),
      delay(1, 5)
    ])
    .done(() => {
      expect(str).to.equal('12345');
      done();
    });
  });

  it('readFile()', function () {
    const filePath = base.path.join(__dirname, '../../', 'fixtures/data/readFileTest.json');

    base.Utils.readFile(filePath)
    .done((data) => {
      expect(data).to.equal('{\n  "what": "test",\n  "year": 2015\n}\n');
    });
  });

  it('readJsonFile()', function () {
    const filePath = base.path.join(__dirname, '../../', 'fixtures/data/readFileTest.json');

    base.Utils.readJsonFile(filePath)
    .done((data) => {
      expect(data.what).to.equal('test');
      expect(data.year).to.equal(2015);
    });
  });

  it('readJsonFile() with JSON parse error', function (done) {
    const filePath = base.path.join(__dirname, '../../', 'fixtures/data/readFileWithError.json');

    base.Utils.readJsonFile(filePath)
    .catch((error) => {
      expect(error.message).to.contain('Error Parsing JSON');
      done();
    });
  });
});
