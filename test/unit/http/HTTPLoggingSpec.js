describe('HTTPLogging', () => {
  const base = this;

  beforeEach(function () {
    nock.disableNetConnect();

    injector().inject(function (HTTPService, Timer, HTTPPlugin, HTTPLogging, Logger) {
      base.HTTPService = HTTPService;
      base.Timer = Timer;
      base.HTTPPlugin = HTTPPlugin;
      base.HTTPLogging = HTTPLogging;
      base.Logger = Logger;

      base.Timer.mockDuration(33);
      base.HTTPService.setGlobalPlugins([base.HTTPLogging]);
      base.Logger.useRecorder();
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should exist', function () {
    expect(base.HTTPService).to.exist;
  });

  it('http success', function (done) {
    nock('http://someurl')
      .get('/')
      .reply(200, { message: 'response' });

    base.HTTPService
      .get('http://someurl')
      .promise().then(() => {
        expect(base.Logger.recorded.log).to.deep.equal([
          ['HTTPService attempting: GET http://someurl'],
          ['HTTPService success: GET http://someurl, timing:33ms, status:200']
        ]);

        done();
      });
  });

  it('http error', function (done) {
    nock('http://someurl')
      .get('/')
      .reply(400, { message: 'response' });

    base.HTTPService
    .get('http://someurl')
    .promise()
    .catch(() => {
      expect(base.Logger.recorded).to.deep.equal({
        log: [['HTTPService attempting: GET http://someurl']],
        error: [['HTTPService error: GET http://someurl, timing:33ms, status:400', 'Validation Error']]
      });

      done();
    });
  });
});
