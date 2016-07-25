describe "Utils Original", ->

  beforeEach ->
    injector().inject (@Utils, @Promise, @path)=>

  it "prop()", ->
    ob = {k:"v"}
    fn = @Utils.prop("k")
    expect(fn(ob)).to.equal "v"

  it "extendWith", ->
    obToExtend = {a:"a"}
    obToExtendWith = {b:"b"}
    fn = @Utils.extendWith(obToExtendWith)
    fn(obToExtend)
    expect(obToExtend).to.deep.equal {
      a:"a", b:"b"
    }

  it "capitalize()", ->
    expect(@Utils.capitalize("foo"))
      .to.equal "Foo"

  it "identity()", ->
    fn = @Utils.identity(2)
    expect(fn()).to.equal 2

  it "mapObject", ->
    ob = {
      one:1
      two:2
    }
    timesTwo = (n)-> n+n
    newOb = @Utils.mapObject(ob, timesTwo)
    expect(newOb).not.to.equal ob
    expect(newOb).to.deep.equal {
      one:2
      two:4
    }


  it "deepClone()", ->
    ob = {name:"hi"}
    ob2 = @Utils.deepClone(ob)
    expect(ob).not.to.equal ob2
    expect(ob).to.deep.equal ob2


  it "promiseQueue()", (done)->
    str = ""
    delay = (ms, val)=> ()=>
      @Promise.delay(ms)
        .then ()-> str += val

    @Utils.promiseQueue([
      delay(5, 1)
      delay(4, 2)
      delay(3, 3)
      delay(2, 4)
      delay(1, 5)
    ]).done ()->
      expect(str).to.equal "12345"
      done()

  it 'readFile()', ->
    filePath = @path.join(__dirname, "../../../", "fixtures/data/readFileTest.json")
    @Utils.readFile(filePath)
      .done (data)->
        expect(data).to.equal('{\n  "what": "test",\n  "year": 2015\n}\n')

  it 'readJsonFile()', ->
    filePath = @path.join(__dirname, "../../../", "fixtures/data/readFileTest.json")
    @Utils.readJsonFile(filePath)
      .done (data)->
        expect(data.what).to.equal("test")
        expect(data.year).to.equal(2015)

  it 'readJsonFile() with JSON parse error', (done)->
    filePath = @path.join(__dirname, "../../../", "fixtures/data/readFileWithError.json")
    @Utils.readJsonFile(filePath)
      .catch (error)->
        expect(error.message).to.contain("Error Parsing JSON")
        done()
