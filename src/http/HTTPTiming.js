module.exports = function (Timer, HTTPPlugin) {
  class HTTPTiming extends HTTPPlugin {

    start() {
      this.timer = new Timer().start();
    }

    end() {
      this.request.duration = this.timer.stop();
    }

  }

  return HTTPTiming;
};
