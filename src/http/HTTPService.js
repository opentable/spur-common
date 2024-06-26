const _compact = require('lodash.compact');
const _invokeMap = require('lodash.invokemap');
const _uniq = require('lodash.uniq');
const _union = require('lodash.union');

module.exports = function (superagent, Promise, FormData, HTTPResponseProcessing) {
  const Request = superagent.Request;

  superagent.globalPlugins = [];

  Request.prototype.plugin = function (plugin) {
    if (!this._plugins) {
      this._plugins = [];
    }

    this._plugins.push(plugin);

    return this;
  };

  Request.prototype.named = function (name) {
    this.name = name;
    return this;
  };

  Request.prototype.tagged = function (tags) {
    this.tags = tags || {};
    return this;
  };

  Request.prototype.getDefaultName = function () {
    return this.url.match(/\/\/(.+)\/?/)[1].replace(/\./g, '_');
  };

  Request.prototype.promise = function () {
    const self = this;

    if (self.name == null) { self.name = this.getDefaultName(); }
    if (self.tags == null) { self.tags = {}; }

    this._plugins = (this._plugins || []).concat(superagent.globalPlugins);
    this._pluginInstances = _compact(this._plugins.map((p) => p.start(self)));

    return new Promise((resolve, reject) => {
      Request.prototype.end.call(self, (err, res) => {
        self.response = res;

        const parser = HTTPResponseProcessing.create(this.method, this.url, res, err).process();
        self.error = parser.error;

        if (self.error) {
          reject(self.error);
        } else {
          resolve(res);
        }

        return _invokeMap(self._pluginInstances, 'end');
      });
    });
  };

  Request.prototype.appendFile = function (name, contents, params) {
    if (this._formData == null) {
      this._formData = new FormData();
    }

    this._formData.append(name, contents, params);

    return this;
  };

  Request.prototype.promiseBody = function () {
    return this.promise().get('body');
  };

  Request.prototype.promiseText = function () {
    return this.promise().get('text');
  };

  Request.prototype.parseBinary = function () {
    return this.parse((res, fn) => {
      res.data = '';
      res.setEncoding('binary');

      res.on('data', (chunk) => {
        res.data += chunk.toString('binary');
      });

      res.on('end', () => {
        fn(null, Buffer.from(res.data, 'binary'));
      });
    }).buffer(true);
  };

  Request.prototype.setFields = function (fields) {
    Object.keys(fields).forEach((key) => {
      this.field(key, fields[key]);
    });

    return this;
  };

  superagent.setGlobalPlugins = function (plugins) {
    if (Array.isArray(plugins)) {
      superagent.globalPlugins = _uniq(_union(superagent.globalPlugins, plugins));
      return superagent.globalPlugins;
    }

    return superagent.addGlobalPlugin(plugins);
  };

  superagent.getGlobalPlugins = () => superagent.globalPlugins;

  superagent.addGlobalPlugin = function (plugin) {
    const checkPluginExists = (pluginOpt) => pluginOpt === plugin;
    if (!superagent.globalPlugins.some(checkPluginExists)) {
      superagent.globalPlugins.push(plugin);
    }

    return superagent.globalPlugins;
  };

  return superagent;
};
