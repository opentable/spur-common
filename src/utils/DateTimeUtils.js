module.exports = function (moment) {
  class DateTimeUtils {

    now() {
      return moment();
    }

    nowMs() {
      return +new Date();
    }

  }

  return new DateTimeUtils();
};
