module.exports = function (console) {
  class BaseDelegate {

    constructor() {
      this.consoleDelegate = this.consoleDelegate.bind(this);
      this.recorderDelegate = this.recorderDelegate.bind(this);
      this.use = this.use.bind(this);
    }

    supportsMethods(_methods) {
      this._methods = _methods;
      for (let i = 0; i < this._methods.length; i++) {
        const methodName = this._methods[i];
        ((methodNameIn) => {
          this[methodNameIn] = (...args) => {
            this.callDelegate(methodNameIn, args);
          };
        })(methodName);
      }

      this.useConsole();
    }

    callDelegate(methodName, args) {
      const items = this.delegates || [];
      items.forEach((delegate) => {
        if (typeof delegate[methodName] === 'function') {
          delegate[methodName].apply(delegate, args);
        } else if (typeof delegate  === 'function') {
          delegate.call(this, methodName, args);
        }
      });
    }

    useNoop() {
      this.delegates = [];
    }

    useConsole() {
      this.delegates = [this.consoleDelegate];
    }

    consoleDelegate(methodName, args) {
      const prefix = this.getLabel(methodName);

      // eslint-disable-next-line no-console
      return console.log.apply(console, [prefix].concat(args));
    }

    getLabel(methodName) {
      return `${this.constructor.name}#${methodName}: `;
    }

    useRecorder() {
      this.delegates = [this.recorderDelegate];
    }

    recorderDelegate(methodName, args) {
      if (!this.recorded) {
        this.recorded = {};
      }

      if (!this.recorded[methodName]) {
        this.recorded[methodName] = [];
      }

      this.recorded[methodName].push(args);
    }

    use(delegate) {
      this.delegates = [delegate];
    }
  }

  return BaseDelegate;
};
