nock = require "nock"
_    = require "lodash"

describe "Original", ->

  describe "HTTPService", ->

    beforeEach ->
      injector().inject (@HTTPService, @Timer, @HTTPPlugin, @HTTPTiming)=>

      @mockDuration = 33
      @Timer.mockDuration(@mockDuration)

      nock.disableNetConnect()

      @containsText = (text, arr)->
        _.every arr, (expectedText)->
          text.indexOf(expectedText) > -1

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

      # Testing against dupe add
      @HTTPService.setGlobalPlugins([@HTTPTiming])

      logs = []

      class HTTPLogging extends @HTTPPlugin
        start:()->
        end:()->
          logs.push @request.name,@request.url

      class HTTPFakePlugin extends @HTTPPlugin
        start:()->
        end:()->

      @HTTPService.addGlobalPlugin(HTTPFakePlugin)

      @HTTPService
        .get("http://someurl")
        .named("LoginService")
        .tagged({endpoint: "EndpointName", tag2: "Some tag value"})
        .plugin(HTTPLogging)
        .promise().then (res)=>
          expect(res.request.name).to.equal "LoginService"
          expect(res.request.tags).to.deep.equal {endpoint: "EndpointName", tag2: "Some tag value"}
          expect(res.request.duration).to.equal @mockDuration
          expect(logs).to.deep.equal [ 'LoginService', 'http://someurl' ]
          expect(@HTTPService.getGlobalPlugins()).to.deep.contain(HTTPFakePlugin)
          expect(@HTTPService.getGlobalPlugins().length).to.equal(2)
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
          logs.push @request.name,@request.url, @request.error.data

      @HTTPService
        .get("http://someurl")
        .named("LoginService")
        .plugin(HTTPLogging)
        .promise().catch (e)->
          expect(e.statusCode).to.equal 400
          expect(e.data).to.deep.equal {message:"response"}
          expect(logs).to.deep.equal [
            'LoginService', 'http://someurl', {"message":"response"}
          ]
          done()


    it "unknown http error",(done)->
      nock("http://someurl")
        .get("/")
        .reply(423, {
          message:"response"
        })
      logs = []

      class HTTPLogging extends @HTTPPlugin
        start:()->
        end:()->
          logs.push @request.name,@request.url, @request.error.data

      @HTTPService
        .get("http://someurl")
        .named("LoginService")
        .plugin(HTTPLogging)
        .promise().catch (e)->
          expect(e.statusCode).to.equal 423
          expect(e.data).to.deep.equal {message:"response"}
          expect(e.message).to.equal "HTTP Error: 423 GET http://someurl"
          expect(logs).to.deep.equal [
            'LoginService', 'http://someurl', {"message":"response"}
          ]
          done()

    it "http append file", (done)->
      nock("http://someurl")
        .filteringRequestBody((@requestBody)=>)
        .post("/")
        .reply(200)

      @HTTPService.post("http://someurl/")
        .appendFile("file", new Buffer("hello world"), {
          filename:"hello.json"
          contentType:"application/json"
        }).promise().then ()=>

          valid = @containsText @requestBody, [
            'Content-Disposition: form-data; name="file"; filename="hello.json"'
            'Content-Type: application/json'
            'hello world'
          ]
          expect(valid).to.equal true
          done()

    describe "headers", ->

      beforeEach ->
        nock.enableNetConnect()
        nock.restore()

      it "should pass in the headers when using GET", (done)->
        testServer.listen(1234)
        @HTTPService
          .get("http://localhost:1234/get-me")
          .set("spur-http-header", "spur-http-header-value")
          .promise().then (response)=>
            headers = JSON.parse(response.text)
            expect(headers["spur-http-header"]).to.equal("spur-http-header-value")
            expect(response.statusCode).to.equal 200
            testServer.close(done)

      it "should pass in the headers when using POST", (done)->
        testServer.listen(1234)
        @HTTPService
          .post("http://localhost:1234/get-me")
          .set("spur-http-header", "spur-http-header-value")
          .promise().then (response)=>
            headers = JSON.parse(response.text)
            expect(headers["spur-http-header"]).to.equal("spur-http-header-value")
            expect(response.statusCode).to.equal 200
            testServer.close(done)
