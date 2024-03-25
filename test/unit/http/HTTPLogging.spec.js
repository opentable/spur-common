const nock = require('nock');

describe('HTTPLogging', function () {

  beforeEach(() => {
    nock.disableNetConnect();

    injector().inject((HTTPService, Timer, HTTPPlugin, HTTPLogging, Logger) => {
      this.HTTPService = HTTPService;
      this.Timer = Timer;
      this.HTTPPlugin = HTTPPlugin;
      this.HTTPLogging = HTTPLogging;
      this.Logger = Logger;

      this.Timer.mockDuration(33);
      this.HTTPService.setGlobalPlugins([this.HTTPLogging]);
      this.Logger.useRecorder();
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

    this.HTTPService
      .get('http://someurl')
      .promise()
      .then(() => {
        expect(this.Logger.recorded.log).toEqual([
          ['HTTPService attempting: GET http://someurl'],
          ['HTTPService success: GET http://someurl, timing:33ms, status:200']
        ]);

        done();
      });
  });

  it('http error', (done) => {
    nock('http://someurl')
      .get('/')
      .reply(400, { message: 'response' });

    this.HTTPService.get('http://someurl')
      .promise()
      .catch(() => {
        expect(this.Logger.recorded).toEqual({
          log: [['HTTPService attempting: GET http://someurl']],
          error: [['HTTPService error: GET http://someurl, timing:33ms, status:400', 'Validation Error']]
        });

        done();
      });
  });
});
