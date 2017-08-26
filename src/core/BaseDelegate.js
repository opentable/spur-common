const _forEach = require('lodash.foreach');
const _isFunction = require('lodash.isfunction');
const _some = require('lodash.some');

module.exports = function (console, consoleColors) {
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
      _forEach(this.delegates, (delegate) => {
        if (_isFunction(delegate[methodName])) {
          delegate[methodName].apply(delegate, args);
        } else if (_isFunction(delegate)) {
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
      const prefix = this.getColoredLabel(methodName);

      // eslint-disable-next-line no-console
      return console.log.apply(console, [prefix].concat(args));
    }

    getColoredLabel(methodName) {
      const label = `${this.constructor.name}#${methodName}: `;
      const checkMethodType = (item) => item === methodName;
      let color = 'cyan';

      if (_some(['fatal', 'error'], checkMethodType)) {
        color = 'red';
      } else if (_some(['warn'], checkMethodType)) {
        color = 'yellow';
      }

      return consoleColors[color](label);
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
