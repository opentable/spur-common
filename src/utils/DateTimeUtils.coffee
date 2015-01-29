module.exports = (moment)->

  new class DateTimeUtils

    now:()->
      moment()

    nowMs:()->
      +new Date
