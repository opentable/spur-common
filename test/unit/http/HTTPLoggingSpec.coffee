nock = require "nock"

describe "HTTPLogging", ->

  beforeEach ->
    injector().inject (@HTTPService, @Timer, @HTTPPlugin, @HTTPLogging, @Logger)=>

    @Timer.mockDuration(33)

    @HTTPService.setGlobalPlugins([@HTTPLogging])

    @Logger.useRecorder()

    nock.disableNetConnect()

  afterEach ->
    nock.cleanAll()

  it "should exist", ->
    expect(@HTTPService).to.exist

  it "http success", (done)->
    nock("http://someurl")
      .get("/")
      .reply(200, {
        message:"response"
      })

    @HTTPService
      .get("http://someurl")
      .promise().then (res)=>
        expect(@Logger.recorded.info).to.deep.equal  [
          [ 'HTTPService attempting: GET http://someurl' ],
          [ 'HTTPService success: GET http://someurl, timing:33ms, status:200' ]
        ]

        done()

  it "http error",(done)->
    nock("http://someurl")
      .get("/")
      .reply(400, {
        message:"response"
      })

    @HTTPService
      .get("http://someurl")
      .promise().catch (e)=>
        expect(@Logger.recorded).to.deep.equal  {
          info: [ [ 'HTTPService attempting: GET http://someurl' ] ],
          error:
           [ [ 'HTTPService error: GET http://someurl, timing:33ms, status:400',
               'Validation Error' ] ]
        }

        done()