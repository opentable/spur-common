registerConfig = require "../../registerConfig"
path           = require "path"

describe "registerConfig", ->

  it "default configName", ->
    ioc = injector()
    configPath = path.join(__dirname, "../fixtures/config")
    registerConfig(ioc, configPath)

    ioc.inject (config, configLoader)->

      expect(config).to.deep.equal {
        a:"a", c:"c"
      }
      expect(configLoader.configName)
        .to.equal "test"

  it "specified configName", ->
    ioc = injector()
    configPath = path.join(__dirname, "../fixtures/config")
    registerConfig(ioc, configPath, "alphaConfig")

    ioc.inject (alphaConfig, alphaConfigLoader)->

      expect(alphaConfig).to.deep.equal {
        a:"a", c:"c"
      }
      expect(alphaConfigLoader.configName)
        .to.equal "test"

  it "errors", ->
    ioc = injector()
    configPath = path.join(__dirname, "../fixtures/config2")
    expect(->
      console.log "===== EXPECTED ERROR BELOW ====="
      registerConfig(ioc, configPath, "alphaConfig")
    ).to.throw()
