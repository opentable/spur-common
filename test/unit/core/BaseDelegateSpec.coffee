describe "BaseDelegate", ->

  beforeEach ->
    @logs = []
    mockConsole =
      log:(args...)=> @logs.push(args)

    injector()
      .addDependency("console", mockConsole, true)
      .inject (@BaseDelegate)=>


  it "should exist", ->
    expect(@BaseDelegate).to.exist

  it "base delegate test", ->

    class SomeDelegate extends @BaseDelegate

      constructor:()->
        @supportsMethods [
          "log", "debug"
        ]

    delegate = new SomeDelegate()
    delegate.log("hi")
    delegate.debug("hello")

    expect(@logs).to.deep.equal [
      [ 'SomeDelegate#log: ', 'hi' ],
      [ 'SomeDelegate#debug: ', 'hello' ]
    ]
    delegate.useRecorder()
    delegate.log("hi2")
    delegate.debug("hello2")
    expect(delegate.recorded.log).to.deep.equal [["hi2"]]
    expect(delegate.recorded.debug).to.deep.equal [["hello2"]]
    delegate.use({
      log:(@delegateLog)=>
      debug:(@delegateDebug)=>
    })
    delegate.log("foo")
    delegate.debug("bar")
    expect(@delegateLog).to.equal "foo"
    expect(@delegateDebug).to.equal "bar"
