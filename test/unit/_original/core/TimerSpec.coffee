describe "Timer Original", ->

  beforeEach ()->
    injector().inject (@Timer, @nodeProcess)=>
      @hrtimeStub = sinon.stub(@nodeProcess, "hrtime")
      @hrtimeStub.onCall(0).returns([ 7973, 560332779])
      @hrtimeStub.onCall(1).returns([ 0, 1065832 ])


  afterEach ()->
    @hrtimeStub.restore()

  it "test timer", ->
    timer = new @Timer().start()

    duration = timer.stop()
    expect(duration).to.equal 1.066

  it "mockDuration()", ->
    @Timer.mockDuration(22)
    expect(new @Timer().start().stop())
      .to.equal 22
