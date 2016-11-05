module.exports = function () {
  class HTTPPlugin {

    constructor(request) {
      this.request = request;
    }

    static start(request) {
      const plugin = new this(request);
      plugin.start();
      return plugin;
    }

    start() {}

    end() {}
  }

  return HTTPPlugin;
};
