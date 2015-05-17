module.exports = (nodeProcess)->

  class Timer

    start:()->
      @startMs = nodeProcess.hrtime()
      @

    stop:()->
      diff = nodeProcess.hrtime(@startMs)
      @duration = @hrtimeArrayToMillisecond(diff)

    @mockDuration:(duration)->
      Timer::stop = -> duration

    hrtimeArrayToMillisecond: (hrarray) ->
      microseconds = Math.round(hrarray[0] * 1e6 + hrarray[1] * 1e-3)
      microseconds / 1000
