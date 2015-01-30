module.exports = ()->

  class HTTPPlugin

    constructor:(@request)->

    @start:(request)->
      plugin = new @(request)
      plugin.start()
      plugin

    start:()->

    end:()->