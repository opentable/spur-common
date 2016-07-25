describe "BaseDelegate Original", ->

  beforeEach ->
    @logs = []
    mockConsole =
      log:(args...)=> @logs.push(args)

    injector()
      .addDependency("console", mockConsole, true)
      .inject (@BaseDelegate)=>

    class @SomeDelegate extends @BaseDelegate

      constructor:()->
        @supportsMethods [
          "log", "debug"
        ]

  it "base delegate test", ->

    delegate = new @SomeDelegate()
    delegate.log("hi")
    delegate.debug("hello")

    expect(@logs).to.deep.equal [
      [ '\u001b[36mSomeDelegate#log: \u001b[39m', 'hi' ],
      [ '\u001b[36mSomeDelegate#debug: \u001b[39m', 'hello' ]
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

  it "multiple delegates", ->

    delegate = new @SomeDelegate()
    delegate.delegates = [
      delegate.consoleDelegate
      delegate.consoleDelegate
      delegate.consoleDelegate
    ]
    delegate.log("foo")
    expect(@logs).to.deep.equal [
      [ '\u001b[36mSomeDelegate#log: \u001b[39m', 'foo' ],
      [ '\u001b[36mSomeDelegate#log: \u001b[39m', 'foo' ],
      [ '\u001b[36mSomeDelegate#log: \u001b[39m', 'foo' ]
    ]
