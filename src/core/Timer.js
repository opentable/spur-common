module.exports = function (nodeProcess) {
  class Timer {

    start() {
      this.startMs = nodeProcess.hrtime();
      return this;
    }

    stop() {
      const diff = nodeProcess.hrtime(this.startMs);
      this.duration = this.hrtimeArrayToMillisecond(diff);
      return this.duration;
    }

    static mockDuration(duration) {
      Timer.prototype.stop = function () {
        return duration;
      };
    }

    hrtimeArrayToMillisecond(hrarray) {
      const microseconds = Math.round(hrarray[0] * 1e6 + hrarray[1] * 1e-3);
      return microseconds / 1000;
    }

  }

  return Timer;
};
