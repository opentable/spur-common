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
      const { error, method, url } = this.input;
      const { code, errno, message, status } = error;

      if (!status) {
        const errorMessage = `HTTP Error: ${method} ${url} ${message}: {code: '${code}', errno: '${errno}'}`;

        switch (errno) {
          case 'ETIMEDOUT':
          case 'ETIME':
            this.error = SpurErrors.GatewayTimeoutError.create(errorMessage, error);
            break;

          default:
            this.error = SpurErrors.InternalServerError.create(errorMessage, error);
            break;
        }
      } else {
        this._setErrorByStatusCode(status);
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
        const body = res.body;
        const errorResponse = (body && body != null && Object.keys(body).length > 0)
          ? res.body
          : res.text;
        this.error.setData(errorResponse);
      }
    }

  }

  return HTTPResponseProcessing;
};
