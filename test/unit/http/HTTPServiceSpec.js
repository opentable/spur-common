const _every = require('lodash.every');

describe('HTTPService', () => {
  const base = this;

  beforeEach(function () {
    nock.disableNetConnect();

    injector().inject(function (HTTPService, Timer, HTTPPlugin, HTTPTiming) {
      base.HTTPService = HTTPService;
      base.Timer = Timer;
      base.HTTPPlugin = HTTPPlugin;
      base.HTTPTiming = HTTPTiming;

      base.mockDuration = 33;
      base.Timer.mockDuration(base.mockDuration);

      base.containsText = (text, arr) => {
        return _every(arr, (expectedText) => {
          return text.indexOf(expectedText) > -1;
        });
      };
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('http success', function (done) {
    nock('http://someurl')
    .get('/')
    .reply(200, { message: 'response' });

    base.HTTPService.setGlobalPlugins([base.HTTPTiming]);

    // Testing against dupe add
    base.HTTPService.setGlobalPlugins([base.HTTPTiming]);

    const logs = [];

    class HTTPLogging extends base.HTTPPlugin {
      start() {}
      end() {
        logs.push(this.request.name, this.request.url);
      }
    }

    class HTTPFakePlugin extends base.HTTPPlugin {
      start() {}
      end() {}
    }

    base.HTTPService.addGlobalPlugin(HTTPFakePlugin);

    base.HTTPService
    .get('http://someurl')
    .named('LoginService')
    .tagged({ endpoint: 'EndpointName', tag2: 'Some tag value' })
    .plugin(HTTPLogging)
    .promise()
    .then((res) => {
      expect(res.request.name).to.equal('LoginService');
      expect(res.request.tags).to.deep.equal({ endpoint: 'EndpointName', tag2: 'Some tag value' });
      expect(res.request.duration).to.equal(base.mockDuration);
      expect(logs).to.deep.equal(['LoginService', 'http://someurl']);
      expect(base.HTTPService.getGlobalPlugins()).to.deep.contain(HTTPFakePlugin);
      expect(base.HTTPService.getGlobalPlugins().length).to.equal(2);
      done();
    });
  });

  it('http error', function (done) {
    nock('http://someurl')
    .get('/')
    .reply(400, { message: 'response' });

    const logs = [];

    class HTTPLogging extends base.HTTPPlugin {
      start() {}
      end() {
        logs.push(this.request.name, this.request.url, this.request.error.data);
      }
    }

    base.HTTPService
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

    class HTTPLogging extends base.HTTPPlugin {
      start() {}
      end() {
        logs.push(this.request.name, this.request.url, this.request.error.data);
      }
    }

    base.HTTPService
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
    .filteringRequestBody((requestBody) => { base.requestBody = requestBody; })
    .post('/')
    .reply(200);

    base.HTTPService.post('http://someurl/')
    .appendFile('file', new Buffer('hello world'), {
      filename: 'hello.json',
      contentType: 'application/json'
    })
    .promise()
    .then(() => {
      const valid = base.containsText(base.requestBody, [
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

      base.HTTPService
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

      base.HTTPService
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
