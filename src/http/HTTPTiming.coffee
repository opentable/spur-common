module.exports = (Timer, HTTPPlugin)->

  class HTTPTiming extends HTTPPlugin

    start:()->
      @timer = new Timer().start()

    end:()=>
      @request.duration = @timer.stop()
