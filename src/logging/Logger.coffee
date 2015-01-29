module.exports = (winston, config, MockLogger)->
  if config.useMockLogger
    return MockLogger
  else
    winston.cli()
    winston
