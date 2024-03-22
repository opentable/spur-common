const nock = require('nock');

describe('HTTPService', function () {

  beforeEach(() => {
    nock.disableNetConnect();

    injector().inject((HTTPService, Timer, HTTPPlugin, HTTPTiming) => {
      this.HTTPService = HTTPService;
      this.Timer = Timer;
      this.HTTPPlugin = HTTPPlugin;
      this.HTTPTiming = HTTPTiming;

      this.mockDuration = 33;
      this.Timer.mockDuration(this.mockDuration);
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('http success', (done) => {
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
        expect(res.request.name).toBe('LoginService');
        expect(res.request.tags).toEqual({ endpoint: 'EndpointName', tag2: 'Some tag value' });
        expect(res.request.duration).toBe(this.mockDuration);
        expect(logs).toEqual(['LoginService', 'http://someurl']);
        expect(this.HTTPService.getGlobalPlugins()).toContain(HTTPFakePlugin);
        expect(this.HTTPService.getGlobalPlugins().length).toBe(2);
        done();
      });
  });

  it('http error', (done) => {
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
        expect(e.statusCode).toBe(400);
        expect(e.data).toEqual({ message: 'response' });
        expect(logs).toEqual(['LoginService', 'http://someurl', { message: 'response' }]);

        done();
      });
  });

  it('timeout error', (done) => {
    const httpServiceConnectionTimeout = 1;
    nock('http://someurl')
      .get('/')
      .delay(httpServiceConnectionTimeout + 1)
      .reply(200, 'FOUND');

    const logs = [];

    class HTTPLogging extends this.HTTPPlugin {
      start() {}
      end() {
        const { response, ...rest } = this.request.error.internalError;
        logs.push(this.request.name, this.request.url, { ...rest });
      }
    }

    this.HTTPService
      .get('http://someurl')
      .timeout(httpServiceConnectionTimeout)
      .named('LoginService')
      .plugin(HTTPLogging)
      .promise()
      .catch((e) => {
        expect(e.statusCode).toBe(504);
        expect(e.message).toBe(`HTTP Error: GET http://someurl Timeout of ${httpServiceConnectionTimeout}ms exceeded: {code: 'ECONNABORTED', errno: 'ETIME'}`);
        expect(logs).toEqual(['LoginService', 'http://someurl', { timeout: httpServiceConnectionTimeout, code: 'ECONNABORTED', errno: 'ETIME' }]);
        done();
      });
  });

  it('unknown http error', (done) => {
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
        expect(e.statusCode).toBe(423);
        expect(e.data).toEqual({ message: 'response' });
        expect(e.message).toBe('HTTP Error: 423 GET http://someurl');
        expect(logs).toEqual(['LoginService', 'http://someurl', { message: 'response' }]);
        done();
      });
  });

  it('http append file', () => {
    let submittedRequestBody = null;

    nock('http://someurl')
      .post('/fake-upload', (requestBody) => {
        submittedRequestBody = requestBody;
        return requestBody;
      })
      .reply(200, 'OK');

    return this.HTTPService
      .post('http://someurl/fake-upload')
      .appendFile('file', Buffer.from('hello world'), {
        filename: 'hello.json',
        contentType: 'application/json'
      })
      .promise()
      .then(() => {
        const expectedLinesInPost = [
          'Content-Disposition: form-data; name="file"; filename="hello.json"',
          'Content-Type: application/json',
          'hello world',
        ];

        expectedLinesInPost.forEach((expectedLine) => {
          expect(submittedRequestBody).toContain(expectedLine);
        });
      });
  });

  describe('headers', () => {
    beforeEach(() => {
      nock.enableNetConnect();
    });

    it('should pass in the headers when using GET', (done) => {
      testServer.listen(1234);

      this.HTTPService
        .get('http://localhost:1234/get-me')
        .set('spur-http-header', 'spur-http-header-value')
        .promise()
        .then((response) => {
          const headers = JSON.parse(response.text);
          expect(headers['spur-http-header']).toBe('spur-http-header-value');
          expect(response.statusCode).toBe(200);
          testServer.close(done);
        });
    });

    it('should pass in the headers when using POST', (done) => {
      testServer.listen(1234);

      this.HTTPService
        .post('http://localhost:1234/get-me')
        .set('spur-http-header', 'spur-http-header-value')
        .promise()
        .then((response) => {
          const headers = JSON.parse(response.text);
          expect(headers['spur-http-header']).toBe('spur-http-header-value');
          expect(response.statusCode).toBe(200);
          testServer.close(done);
        });
    });
  });
});
