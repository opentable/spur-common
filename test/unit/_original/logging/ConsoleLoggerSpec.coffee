describe "ConsoleLogger Original", ->

  beforeEach ()->
    @MockLogger = {
      "log": sinon.stub()
    }

    injector()
      .addDependency("console", @MockLogger, true)
      .inject (@ConsoleLogger, @console, @_)=>

    @getResult = ()->
      @_.last(@console.log.getCalls()).args

  it "should fatal()", ->
    @ConsoleLogger.fatal("testing fatal")
    expect(@getResult()).to.deep.equal ["\u001b[31mConsoleLogger#fatal: \u001b[39m", "testing fatal"]

  it "should error()", ->
    @ConsoleLogger.error("testing error")
    expect(@getResult()).to.deep.equal ["\u001b[31mConsoleLogger#error: \u001b[39m", "testing error"]

  it "should warn()", ->
    @ConsoleLogger.warn("testing warn")
    expect(@getResult()).to.deep.equal ["\u001b[33mConsoleLogger#warn: \u001b[39m", "testing warn"]

  it "should info()", ->
    @ConsoleLogger.info("testing info")
    expect(@getResult()).to.deep.equal ["\u001b[36mConsoleLogger#info: \u001b[39m", "testing info"]

  it "should log()", ->
    @ConsoleLogger.log("testing log")
    expect(@getResult()).to.deep.equal ["\u001b[36mConsoleLogger#log: \u001b[39m", "testing log"]

  it "should debug()", ->
    @ConsoleLogger.debug("testing debug")
    expect(@getResult()).to.deep.equal ["\u001b[36mConsoleLogger#debug: \u001b[39m", "testing debug"]

  it "should verbose()", ->
    @ConsoleLogger.verbose("testing verbose")
    expect(@getResult()).to.deep.equal ["\u001b[36mConsoleLogger#verbose: \u001b[39m", "testing verbose"]
