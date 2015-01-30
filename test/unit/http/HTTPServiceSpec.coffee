nock = require "nock"

describe "HTTPService", ->

  beforeEach ->
    injector().inject (@HTTPService, @Timer, @HTTPPlugin, @HTTPTiming)=>

    @Timer.mockDuration(33)

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

    @HTTPService.setGlobalPlugins([@HTTPTiming])

    logs = []

    class HTTPLogging extends @HTTPPlugin
      start:()->
      end:()->
        logs.push @request.name,@request.url

    @HTTPService
      .get("http://someurl")
      .named("LoginService")
      .plugin(HTTPLogging)
      .promise().then (res)->
        expect(res.request.name).to.equal "LoginService"
        expect(res.request.duration).to.equal 33
        expect(logs).to.deep.equal [ 'LoginService', 'http://someurl' ]
        done()

  it "http error",(done)->
    nock("http://someurl")
      .get("/")
      .reply(400, {
        message:"response"
      })
    logs = []

    class HTTPLogging extends @HTTPPlugin
      start:()->
      end:()->
        logs.push @request.name,@request.url, @request.error.data.text

    @HTTPService
      .get("http://someurl")
      .named("LoginService")
      .plugin(HTTPLogging)
      .promise().catch (e)->
        expect(e.statusCode).to.equal 400
        expect(logs).to.deep.equal [
          'LoginService', 'http://someurl', '{"message":"response"}'
        ]
        done()
