module.exports = function () {
  class Module {

    constructor(...args) {
      const modules = this.$modules || [];

      modules.forEach((module) => {
        module.apply(this, args);
      });
    }

    include(module) {
      Object.keys(module.prototype).forEach((key) => {
        this[key] = module[key];
      });

      module.apply(this);
    }

    static include(obj) {
      if (!this.prototype.$modules) {
        this.prototype.$modules = [];
      }

      this.prototype.$modules.push(obj);

      Object.keys(obj.prototype).forEach((key) => {
        this.prototype[key] = obj.prototype[key];
      });

      return this;
    }
  }

  return Module;
};
