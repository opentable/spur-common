describe('FixtureCache', function () {

  beforeEach(() => {
    injector()
      .inject((FixtureCache, Promise) => {
        this.FixtureCache = FixtureCache;
        this.Promise = Promise;
      });
  });

  it('should initialize with an empty cache', () => {
    expect(this.FixtureCache.cache).to.deep.equal({});
  });

  describe('set', () => {
    beforeEach(() => {
      this.testSet = (name, value) => {
        this.FixtureCache.set(name, value);
        expect(this.FixtureCache.cache[name]).to.deep.equal(value);
      };
    });
    it('should set integer', () => {
      this.testSet('test-int', 1234);
    });

    it('should set string', () => {
      this.testSet('test-string', 'my string');
    });

    it('should set bool', () => {
      this.testSet('test-bool-true', true);
      this.testSet('test-bool-false', false);
    });

    it('should set object', () => {
      this.testSet('test-object', { someValue: 'hi', second: { someProp: 'someValue' } });
    });

    it('should set date', () => {
      this.testSet('test-date', new Date());
    });
  });

  describe('get', () => {
    beforeEach(() => {
      this.expectedTestDate = new Date();
      this.FixtureCache.cache = {
        'test-int': 1234,
        'test-string': 'my string',
        'test-bool-true': true,
        'test-bool-false': false,
        'test-object': { someValue: 'hi', second: { someProp: 'someValue' } },
        'test-date': this.expectedTestDate
      };

      this.testGet = (name, value) => {
        const result = this.FixtureCache.get(name);
        expect(result).to.deep.equal(value);
      };
    });
    it('should set integer', () => {
      this.testGet('test-int', 1234);
    });

    it('should set string', () => {
      this.testGet('test-string', 'my string');
    });

    it('should set bool', () => {
      this.testGet('test-bool-true', true);
      this.testGet('test-bool-false', false);
    });

    it('should set object', () => {
      this.testGet('test-object', { someValue: 'hi', second: { someProp: 'someValue' } });
    });

    it('should set date', () => {
      this.testGet('test-date', this.expectedTestDate);
    });
  });

  describe('getOrPromise', () => {
    beforeEach(() => {
      this.fetchCallback = () => { return this.Promise.resolve('non-cached value'); };
      sinon.spy(this, 'fetchCallback');
    });

    it('should only make a cache hit when cache entry exists', () => {
      this.FixtureCache.cache.existingKeyEntry = 'cached value';
      this.FixtureCache.getOrPromise('existingKeyEntry', this.fetchCallback)
        .then((result) => {
          expect(result).to.equal('cached value');
          expect(this.fetchCallback.notCalled).to.equal(true);
        });
    });

    it('should call fetch callback when entry is not in cache', () => {
      this.FixtureCache.getOrPromise('existingKeyEntry', this.fetchCallback)
        .then((result) => {
          expect(result).to.equal('non-cached value');
          expect(this.fetchCallback.called).to.equal(true);
        });
    });
  });
});
