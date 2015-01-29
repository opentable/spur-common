describe "DateTimeUtils", ->

  beforeEach ()->
    @clock = sinon.useFakeTimers()
    injector().inject (@DateTimeUtils, @moment)=>

  afterEach ()->
    @clock.restore()

  it "should exist", ->
    expect(@DateTimeUtils).to.exist

  it "now()", ->
    expect(@DateTimeUtils.now())
      .to.deep.equal @moment()

  it "nowMs()", ->
    expect(@DateTimeUtils.nowMs()).to.equal +new Date
