describe "Timer", ->

  beforeEach ()->
    injector().inject (@Timer)=>

  afterEach ()->

  it "test timer", ->
    clock = sinon.useFakeTimers()
    timer = new @Timer().start()
    clock.tick(25)
    expect(timer.stop()).to.equal 25
    clock.restore()

  it "mockDuration()", ->
    @Timer.mockDuration(22)
    expect(new @Timer().start().stop())
      .to.equal 22
