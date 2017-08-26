module.exports = function (Timer, HTTPPlugin, Logger) {
  class HTTPLogging extends HTTPPlugin {

    start() {
      this.timer = new Timer().start();

      Logger.log(`HTTPService attempting: ${this.request.method} ${this.request.url}`);
    }

    end() {
      const duration = this.timer.stop();

      if (this.request.error) {
        const status = (this.request.response) ? this.request.response.status : null;

        Logger.error(`HTTPService error: ${this.request.method} ${this.request.url}, timing:${duration}ms, status:${status}`, this.request.error.message);
      } else if (this.request.response) {
        Logger.log(`HTTPService success: ${this.request.method} ${this.request.url}, timing:${duration}ms, status:${this.request.response.status}`);
      }
    }

  }

  return HTTPLogging;
};
