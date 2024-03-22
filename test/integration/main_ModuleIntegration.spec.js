const spur = require('spur-ioc');
const mainModule = require('../../');

describe('Integration', function () {

  describe('Main Module Integration Tests', () => {

    beforeEach(() =>{
      this.console = console;
      this.JSON = JSON;

      this.ioc = spur.create('test-spur-common');
      this.ioc.merge(mainModule());
    });

    describe('base dependencies', () => {

      it('base module dependencies are injectable', () => {
        this.ioc.inject((Promise, fs, path, SpurErrors, superagent, FormData, consoleColors) => {
          expect(Promise).toBeDefined();
          expect(fs).toBeDefined();
          expect(path).toBeDefined();
          expect(SpurErrors).toBeDefined();
          expect(superagent).toBeDefined();
          expect(FormData).toBeDefined();
          expect(consoleColors).toBeDefined();
        });
      });

      it('should inject `console` and match type', () => {
        this.ioc.inject(function (console) {
          expect(console).toEqual(this.console);
        });
      });

      it('should inject `JSON` and match type', () => {
        this.ioc.inject(function (JSON) {
          expect(JSON).toEqual(this.JSON);
        });
      });

      it('should inject `nodeProcess` and match type', () => {
        this.ioc.inject(function (nodeProcess) {
          expect(nodeProcess).toEqual(process);
        });
      });
    });

  });
});
