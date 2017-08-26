describe('BaseDelegate', () => {

  const base = this;

  beforeEach(function () {
    base.logs = [];

    const mockConsole = {
      log: (...args) => base.logs.push(args)
    };

    injector()
    .addDependency('console', mockConsole, true)
    .inject(function (BaseDelegate) {
      base.BaseDelegate = BaseDelegate;

      class SomeDelegate extends base.BaseDelegate {

        constructor() {
          super();
          this.supportsMethods([
            'log', 'debug'
          ]);
        }
      }

      base.SomeDelegate = SomeDelegate;
    });
  });

  it('base delegate test', () => {
    const delegate = new base.SomeDelegate();
    delegate.log('hi');
    delegate.debug('hello');

    expect(base.logs).to.deep.equal([
      ['\u001b[36mSomeDelegate#log: \u001b[39m', 'hi'],
      ['\u001b[36mSomeDelegate#debug: \u001b[39m', 'hello']
    ]);

    delegate.useRecorder();
    delegate.log('hi2');
    delegate.debug('hello2');
    expect(delegate.recorded.log).to.deep.equal([['hi2']]);
    expect(delegate.recorded.debug).to.deep.equal([['hello2']]);

    delegate.use({
      log: (delegateLog) => { this.delegateLog = delegateLog; },
      debug: (delegateDebug) => { this.delegateDebug = delegateDebug; }
    });

    delegate.log('foo');
    delegate.debug('bar');

    expect(this.delegateLog).to.equal('foo');
    expect(this.delegateDebug).to.equal('bar');
  });

  it('multiple delegates', function () {
    const delegate = new base.SomeDelegate();
    delegate.delegates = [
      delegate.consoleDelegate,
      delegate.consoleDelegate,
      delegate.consoleDelegate
    ];

    delegate.log('foo');

    expect(base.logs).to.deep.equal([
      ['\u001b[36mSomeDelegate#log: \u001b[39m', 'foo'],
      ['\u001b[36mSomeDelegate#log: \u001b[39m', 'foo'],
      ['\u001b[36mSomeDelegate#log: \u001b[39m', 'foo']
    ]);
  });
});
