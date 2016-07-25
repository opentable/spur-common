describe "fsPromise Original", ->

  beforeEach ->
    injector().inject (@fsPromise)=>

  it "should exist", ->
    expect(@fsPromise).to.exist
    expect(@fsPromise.exists).to.exist
    expect(@fsPromise.writeFileAsync).to.exist
