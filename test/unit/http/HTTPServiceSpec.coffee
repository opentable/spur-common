describe "HTTPService", ->

  beforeEach ()->
    injector().inject (@HTTPService)=>

  afterEach ()->

  it "should exist", ->
    expect(@HTTPService).to.exist
