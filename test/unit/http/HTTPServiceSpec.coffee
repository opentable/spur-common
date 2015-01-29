nock = require "nock"

describe "HTTPService", ->

  beforeEach ()->
    nock.disableNetConnect()
    injector()
    .addDependency("config", {
        useMockLogger:true
      }, true)
    .inject (@HTTPService, @Timer, @SpurErrors)=>

  afterEach ()->

  it "should exist", ->
    expect(@HTTPService).to.exist

  it "success", ->
    nock("http://someurl")
      .get("/")
      .reply(200, {
        message:"response"
      })

    @HTTPService.get("http://someurl/").promise()
      .then (res)=>
        expect(res.status).to.equal 200
        expect(res.body).to.deep.equal {
          message:"response"
        }

  it "not found", ->
    nock("http://somebadurl")
      .get("/")
      .reply(404)

    @HTTPService.get("http://somebadurl/").promise()
      .catch (e)=>
        expect(e instanceof @SpurErrors.NotFoundError)
