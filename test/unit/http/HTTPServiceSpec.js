describe('HTTPService', () => {
  beforeEach(function () {
    nock.disableNetConnect();

    injector().inject((HTTPService, Timer, HTTPPlugin, HTTPTiming) => {
      this.HTTPService = HTTPService;
      this.Timer = Timer;
      this.HTTPPlugin = HTTPPlugin;
      this.HTTPTiming = HTTPTiming;

      this.mockDuration = 33;
      this.Timer.mockDuration(this.mockDuration);

      this.containsText = (text, arr) => {
        return _.every(arr, (expectedText) => {
          return text.indexOf(expectedText) > -1;
        });
      };
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should exist', function () {
    expect(this.HTTPService).to.exist;
  });

  it('http success', function (done) {
    nock('http://someurl')
    .get('/')
    .reply(200, { message: 'response' });

    this.HTTPService.setGlobalPlugins([this.HTTPTiming]);

    // Testing against dupe add
    this.HTTPService.setGlobalPlugins([this.HTTPTiming]);

    const logs = [];

    class HTTPLogging extends this.HTTPPlugin {
      start() {}
      end() {
        logs.push(this.request.name, this.request.url);
      }
    }

    class HTTPFakePlugin extends this.HTTPPlugin {
      start() {}
      end() {}
    }

    this.HTTPService.addGlobalPlugin(HTTPFakePlugin);

    this.HTTPService
    .get('http://someurl')
    .named('LoginService')
    .tagged({ endpoint: 'EndpointName', tag2: 'Some tag value' })
    .plugin(HTTPLogging)
    .promise()
    .then((res) => {
      expect(res.request.name).to.equal('LoginService');
      expect(res.request.tags).to.deep.equal({ endpoint: 'EndpointName', tag2: 'Some tag value' });
      expect(res.request.duration).to.equal(this.mockDuration);
      expect(logs).to.deep.equal(['LoginService', 'http://someurl']);
      expect(this.HTTPService.getGlobalPlugins()).to.deep.contain(HTTPFakePlugin);
      expect(this.HTTPService.getGlobalPlugins().length).to.equal(2);
      done();
    });
  });

  it('http error', function (done) {
    nock('http://someurl')
    .get('/')
    .reply(400, { message: 'response' });

    const logs = [];

    class HTTPLogging extends this.HTTPPlugin {
      start() {}
      end() {
        logs.push(this.request.name, this.request.url, this.request.error.data);
      }
    }

    this.HTTPService
    .get('http://someurl')
    .named('LoginService')
    .plugin(HTTPLogging)
    .promise()
    .catch((e) => {
      expect(e.statusCode).to.equal(400);
      expect(e.data).to.deep.equal({ message: 'response' });
      expect(logs).to.deep.equal(['LoginService', 'http://someurl', { message: 'response' }]);

      done();
    });
  });

  it('unknown http error', function (done) {
    nock('http://someurl')
    .get('/')
    .reply(423, { message: 'response' });

    const logs = [];

    class HTTPLogging extends this.HTTPPlugin {
      start() {}
      end() {
        logs.push(this.request.name, this.request.url, this.request.error.data);
      }
    }

    this.HTTPService
    .get('http://someurl')
    .named('LoginService')
    .plugin(HTTPLogging)
    .promise()
    .catch((e) => {
      expect(e.statusCode).to.equal(423);
      expect(e.data).to.deep.equal({ message: 'response' });
      expect(e.message).to.equal('HTTP Error: 423 GET http://someurl');
      expect(logs).to.deep.equal(['LoginService', 'http://someurl', { message: 'response' }]);
      done();
    });
  });

  it('http append file', function (done) {
    nock('http://someurl')
    .filteringRequestBody((requestBody) => { this.requestBody = requestBody; })
    .post('/')
    .reply(200);

    this.HTTPService.post('http://someurl/')
    .appendFile('file', new Buffer('hello world'), {
      filename: 'hello.json',
      contentType: 'application/json'
    })
    .promise()
    .then(() => {
      const valid = this.containsText(this.requestBody, [
        'Content-Disposition: form-data; name="file"; filename="hello.json"',
        'Content-Type: application/json',
        'hello world'
      ]);
      expect(valid).to.equal(true);
      done();
    });
  });

  describe('headers', () => {
    beforeEach(() => {
      nock.enableNetConnect();
    });

    it('should pass in the headers when using GET', function (done) {
      testServer.listen(1234);

      this.HTTPService
      .get('http://localhost:1234/get-me')
      .set('spur-http-header', 'spur-http-header-value')
      .promise()
      .then((response) => {
        const headers = JSON.parse(response.text);
        expect(headers['spur-http-header']).to.equal('spur-http-header-value');
        expect(response.statusCode).to.equal(200);
        testServer.close(done);
      });
    });

    it('should pass in the headers when using POST', function (done) {
      testServer.listen(1234);

      this.HTTPService
      .post('http://localhost:1234/get-me')
      .set('spur-http-header', 'spur-http-header-value')
      .promise()
      .then((response) => {
        const headers = JSON.parse(response.text);
        expect(headers['spur-http-header']).to.equal('spur-http-header-value');
        expect(response.statusCode).to.equal(200);
        testServer.close(done);
      });
    });
  });
});
