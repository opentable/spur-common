describe "UncaughtHandler Original", ->

  beforeEach ->
    @mockProcess =
      on:(@event, @errorFn)=>
      exit:(@exitCode)=>

    ioc = injector()
    ioc.addDependency("nodeProcess", @mockProcess, true)
    ioc.inject (@UncaughtHandler, @Logger)=>

      @Logger.useRecorder()

  it "should exist", ->
    expect(@UncaughtHandler).to.exist

  it "should listen and process uncaughtException", ->
    @UncaughtHandler.listen()
    expect(@event).to.equal "uncaughtException"
    @errorFn(new Error("Oops!"))
    expect(@Logger.recorded.error[0][0].message).to.equal "Oops!"
    expect(@exitCode).to.equal 0
