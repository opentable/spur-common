module.exports = ()->

  class Timer

    start:()->
      @startMs = +new Date
      @

    stop:()->
      @duration = +new Date - @startMs

    @mockDuration:(duration)->
      Timer::stop = -> duration
