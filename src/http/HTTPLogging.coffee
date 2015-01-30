module.exports = (Timer, HTTPPlugin, Logger)->

  class HTTPLogging extends HTTPPlugin

    start:()->
      @timer = new Timer().start()

      Logger.info("HTTPService attempting: #{@request.method} #{@request.url}")

    end:()=>
      duration = @timer.stop()
      if @request.error
        Logger.error("HTTPService error: #{@request.method} #{@request.url}, timing:#{duration}ms, status:#{@request.response?.status}", @request.error.message)
      else if @request.response
        Logger.info("HTTPService success: #{@request.method} #{@request.url}, timing:#{duration}ms, status:#{@request.response.status}")

