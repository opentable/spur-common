import spur from 'spur-ioc';
// NEED to use require vs import to test module export for backward compatability
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
        this.ioc.inject((_, Promise, fs, path, SpurErrors, winston, moment, superagent, FormData, consoleColors) => {
          expect(_).to.exist;
          expect(Promise).to.exist;
          expect(fs).to.exist;
          expect(path).to.exist;
          expect(SpurErrors).to.exist;
          expect(winston).to.exist;
          expect(moment).to.exist;
          expect(superagent).to.exist;
          expect(FormData).to.exist;
          expect(consoleColors).to.exist;
        });
      });

      it('should inject `console` and match type', function () {
        this.ioc.inject((console) => {
          expect(console).to.equal(this.console);
        });
      });

      it('should inject `JSON` and match type', function () {
        this.ioc.inject((JSON) => {
          expect(JSON).to.equal(this.JSON);
        });
      });

      it('should inject `nodeProcess` and match type', function () {
        this.ioc.inject((nodeProcess) => {
          expect(nodeProcess).to.equal(process);
        });
      });
    });

    describe('versions', () => {
      it('should be using lodash 3.x', function () {
        this.ioc.inject((_) => {
          const result = Number(_.VERSION.split('.')[0]);
          expect(result).to.equal(3);
        });
      });

      it('should be using moment 2.x', function () {
        this.ioc.inject((moment) => {
          const result = Number(moment.version.split('.')[0]);
          expect(result).to.equal(2);
        });
      });
    });
  });
});
