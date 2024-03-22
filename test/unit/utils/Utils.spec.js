describe('Utils', function () {

  beforeEach(() => {
    injector().inject((Utils, Promise, path) => {
      this.Utils = Utils;
      this.Promise = Promise;
      this.path = path;
    });
  });

  it('prop()', () => {
    const ob = { k: 'v' };
    const fn = this.Utils.prop('k');

    expect(fn(ob)).toBe('v');
  });

  it('extendWith', () => {
    const obToExtend = { a: 'a' };
    const obToExtendWith = { b: 'b' };

    const fn = this.Utils.extendWith(obToExtendWith);

    fn(obToExtend);

    expect(obToExtend).toEqual({
      a: 'a', b: 'b'
    });
  });

  it('capitalize()', () => {
    expect(this.Utils.capitalize('foo')).toBe('Foo');
  });

  it('identity()', () => {
    const fn = this.Utils.identity(2);
    expect(fn()).toBe(2);
  });

  it('mapObject', () => {
    const ob = {
      one: 1,
      two: 2
    };
    const timesTwo = (n) => n + n;
    const newOb = this.Utils.mapObject(ob, timesTwo);

    expect(newOb).not.toBe(ob);
    expect(newOb).toEqual({
      one: 2,
      two: 4
    });
  });

  it('deepClone()', () => {
    const ob = { name: 'hi' };
    const ob2 = this.Utils.deepClone(ob);

    expect(ob).not.toBe(ob2);
    expect(ob).toEqual(ob2);
  });

  it('promiseQueue()', (done) => {
    let str = '';
    const delay = (ms, val) => {
      return () => {
        return this.Promise.delay(ms)
          .then(() => {
            str += val;
            return str;
          });
      };
    };

    this.Utils.promiseQueue([
      delay(5, 1),
      delay(4, 2),
      delay(3, 3),
      delay(2, 4),
      delay(1, 5)
    ])
    .done(() => {
      expect(str).toBe('12345');
      done();
    });
  });

  it('readFile()', () => {
    const filePath = this.path.join(__dirname, '../../', 'fixtures/data/readFileTest.json');

    this.Utils.readFile(filePath)
      .done((data) => {
        expect(data).toBe('{\n  "what": "test",\n  "year": 2015\n}\n');
      });
  });

  it('readJsonFile()', () => {
    const filePath = this.path.join(__dirname, '../../', 'fixtures/data/readFileTest.json');

    this.Utils.readJsonFile(filePath)
      .done((data) => {
        expect(data.what).toBe('test');
        expect(data.year).toBe(2015);
      });
  });

  it('readJsonFile() with JSON parse error', (done) => {
    const filePath = this.path.join(__dirname, '../../', 'fixtures/data/readFileWithError.json');

    this.Utils.readJsonFile(filePath)
      .catch((error) => {
        expect(error.message).toContain('Error Parsing JSON');
        done();
      });
  });
});
