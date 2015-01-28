describe "Module", ->

  beforeEach ()->
    injector().inject (@Module)=>

  afterEach ()->

  it "should exist", ->
    expect(@Module).to.exist
