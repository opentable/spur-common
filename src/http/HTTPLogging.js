module.exports = function (Timer, HTTPPlugin, Logger) {
  class HTTPLogging extends HTTPPlugin {

    start() {
      this.timer = new Timer().start();

      Logger.log(`HTTPService attempting: ${this.request.method} ${this.request.url}`);
    }

    end() {
      const duration = this.timer.stop();

      if (this.request.error) {
        // eslint-disable-next-line max-len
        Logger.error(`HTTPService error: ${this.request.method} ${this.request.url}, timing:${duration}ms, status:${this.request.response.status}`, this.request.error.message);
      } else if (this.request.response) {
        // eslint-disable-next-line max-len
        Logger.log(`HTTPService success: ${this.request.method} ${this.request.url}, timing:${duration}ms, status:${this.request.response.status}`);
      }
    }

  }

  return HTTPLogging;
};
