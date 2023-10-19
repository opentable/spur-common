const _isEmpty = require('lodash.isempty');

module.exports = function (SpurErrors) {
  class HTTPResponseProcessing {

    constructor(method, url, response, error) {
      this.input = { method, url, response, error };
    }

    static create(method, url, response, error) {
      const instance = new HTTPResponseProcessing(method, url, response, error);
      return instance;
    }

    process() {
      this._process();
      return this;
    }

    _process() {
      if (this.input.error) {
        this._processError();
      } else {
        this._processNonError();
      }
    }

    _processError() {
      const err = this.input.error;

      if (!err.status) {
        const errorMessage = `HTTP Error: ${this.input.method} ${this.input.url} ${err.message}`;
        this.error = SpurErrors.InternalServerError.create(errorMessage, err);
      } else {
        this._setErrorByStatusCode(err.status);
      }
    }

    _processNonError() {
      const res = this.input.response;

      if (res.status >= 400) {
        this._setErrorByStatusCode(res.status);
      }
    }

    _setErrorByStatusCode(status) {
      const res = this.input.response;
      const errorType = SpurErrors.errorByStatusCode(status);

      if (errorType) {
        this.error = errorType.create();
      }

      if (!this.error) {
        const errorMessage = `HTTP Error: ${res.status} ${this.input.method} ${this.input.url}`;
        this.error = SpurErrors.BaseError.create(errorMessage).setStatusCode(status);
      }

      this._setErrorData(res);
    }

    _setErrorData(res) {
      if (this.error) {
        const errorResponse = _isEmpty(res.body) ? res.text : res.body;
        this.error.setData(errorResponse);
      }
    }

  }

  return HTTPResponseProcessing;
};
