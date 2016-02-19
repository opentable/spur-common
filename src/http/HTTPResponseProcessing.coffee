module.exports = (SpurErrors, _)->

  class HTTPResponseProcessing

    constructor: (method, url, response, error)->
      @input = {method, url, response, error}

    @create: (method, url, response, error)->
      instance = new HTTPResponseProcessing(method, url, response, error)
      instance

    process: ()->
      @_process()
      @

    _process: ()->
      if @input.error
        @_processError()
      else
        @_processNonError()

    _processError: ()->
      err = @input.error
      res = @input.response

      if not err.status
        @error = SpurErrors.InternalServerError.create("HTTP Error: #{@input.method} #{@input.url} #{err.message}", err)
      else
        @_setErrorByStatusCode(err.status)

    _processNonError: ()->
      res = @input.response

      if res.status >= 400
        @_setErrorByStatusCode(res.status)

    _setErrorByStatusCode: (status)->
      res = @input.response

      @error = SpurErrors.errorByStatusCode(status)?.create()

      unless @error
        @error = SpurErrors.BaseError.create("HTTP Error: #{res.status} #{@input.method} #{@input.url}")
          .setStatusCode(status)

      @_setErrorData(res)

    _setErrorData: (res)->
      if @error

        errorResponse =
          if _.isEmpty(res.body)
            res.text
          else
            res.body

        @error.setData(errorResponse)


