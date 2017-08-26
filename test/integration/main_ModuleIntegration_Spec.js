const spur = require('spur-ioc');
const mainModule = require('../../');

describe('Integration', () => {
  describe('Main Module Integration Tests', () => {
    beforeEach(function () {
      this.console = console;
      this.JSON = JSON;

      this.ioc = spur.create('test-spur-common');
      this.ioc.merge(mainModule());
    });

    describe('base dependencies', () => {
      it('base module dependencies are injectable', function () {
        this.ioc.inject(function (Promise, fs, path, SpurErrors, superagent, FormData, consoleColors) {
          expect(Promise).to.exist;
          expect(fs).to.exist;
          expect(path).to.exist;
          expect(SpurErrors).to.exist;
          expect(superagent).to.exist;
          expect(FormData).to.exist;
          expect(consoleColors).to.exist;
        });
      });

      it('should inject `console` and match type', function () {
        this.ioc.inject(function (console) {
          expect(console).to.equal(this.console);
        });
      });

      it('should inject `JSON` and match type', function () {
        this.ioc.inject(function (JSON) {
          expect(JSON).to.equal(this.JSON);
        });
      });

      it('should inject `nodeProcess` and match type', function () {
        this.ioc.inject(function (nodeProcess) {
          expect(nodeProcess).to.equal(process);
        });
      });
    });

  });
});
