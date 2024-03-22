const path = require('path');
const registerConfig = require('../../registerConfig');

describe('Integration', function () {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('registerConfig Module Integration Tests', () => {

    it('default configName', () => {
      const ioc = injector();
      const configPath = path.join(__dirname, '../fixtures/config');

      registerConfig(ioc, configPath);

      ioc.inject((config, configLoader) => {
        expect(config).toEqual({ a: 'a', c: 'c' });
        expect(configLoader.configName).toBe('test');
      });
    });

    it('specified configName', () => {
      const ioc = injector();
      const configPath = path.join(__dirname, '../fixtures/config');

      registerConfig(ioc, configPath, 'alphaConfig');

      ioc.inject((alphaConfig, alphaConfigLoader) => {
        expect(alphaConfig).toEqual({ a: 'a', c: 'c' });
        expect(alphaConfigLoader.configName).toBe('test');
      });
    });

    it('errors', () => {
      const ioc = injector();
      const configPath = path.join(__dirname, '../fixtures/config2');

      jest.spyOn(console, 'error').mockReturnThis();

      expect(() => {
        registerConfig(ioc, configPath, 'alphaConfig');
      })
      .toThrow();
    });

  });

});
