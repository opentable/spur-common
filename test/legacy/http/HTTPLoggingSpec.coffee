describe "Original", ->

  describe "HTTPLogging", ->

    beforeEach ->
      nock.disableNetConnect()

      injector().inject (@HTTPService, @Timer, @HTTPPlugin, @HTTPLogging, @Logger)=>
        @Timer.mockDuration(33)
        @HTTPService.setGlobalPlugins([@HTTPLogging])
        @Logger.useRecorder()

    afterEach ->
      nock.cleanAll()
      nock.enableNetConnect()

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
          expect(@Logger.recorded.log).to.deep.equal  [
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
            log: [ [ 'HTTPService attempting: GET http://someurl' ] ],
            error:
             [ [ 'HTTPService error: GET http://someurl, timing:33ms, status:400',
                 'Validation Error' ] ]
          }

          done()
