const path = require('path');
const registerConfig = require('../../registerConfig');

describe('Integration', () => {
  describe('registerConfig Module Integration Tests', () => {
    it('default configName', () => {
      const ioc = injector();
      const configPath = path.join(__dirname, '../fixtures/config');

      registerConfig(ioc, configPath);

      ioc.inject(function (config, configLoader) {
        expect(config).to.deep.equal({ a: 'a', c: 'c' });
        expect(configLoader.configName).to.equal('test');
      });
    });

    it('specified configName', () => {
      const ioc = injector();
      const configPath = path.join(__dirname, '../fixtures/config');

      registerConfig(ioc, configPath, 'alphaConfig');

      ioc.inject(function (alphaConfig, alphaConfigLoader) {
        expect(alphaConfig).to.deep.equal({ a: 'a', c: 'c' });
        expect(alphaConfigLoader.configName).to.equal('test');
      });
    });

    it('errors', () => {
      const ioc = injector();
      const configPath = path.join(__dirname, '../fixtures/config2');

      expect(() => {
        console.log('===== EXPECTED ERROR BELOW =====');
        registerConfig(ioc, configPath, 'alphaConfig');
      })
      .to.throw();
    });
  });
});
