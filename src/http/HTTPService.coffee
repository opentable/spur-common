module.exports = (superagent, Promise, _, SpurErrors, FormData)->
  Request = superagent.Request

  superagent.globalPlugins = []

  Request::plugin = (plugin)->
    (@_plugins ?= []).push(plugin)
    @

  Request::named = (@name)-> @

  Request::tags = (@tags = {})-> @

  Request::getDefaultName = ->
    return @url.match(/\/\/(.+)\/?/)[1].replace(/\./g, "_")

  Request::promise = ->
    self = this
    self.name ?= @getDefaultName()
    self.tags ?= {}
    @_plugins = (@_plugins or []).concat(superagent.globalPlugins)
    @_pluginInstances = _.compact _.map @_plugins, (p)->
      p.start(self)

    return new Promise (resolve, reject)=>
      Request::end.call self, (err, res)=>
        self.response = res
        if err
          self.error = SpurErrors.InternalServerError.create("HTTP Error: #{@method} #{@url} #{err.message}", err)
        else if res.status >= 400
          self.error = SpurErrors.errorByStatusCode(res.status)?.create()
          unless self.error
            self.error = SpurErrors.BaseError.create("HTTP Error: #{res.status} #{@method} #{@url}")
              .setStatusCode(res.status)

          errorResponse =
            if _.isEmpty(res.body)
              res.text
            else
              res.body

          self.error.setData(errorResponse)

        if self.error
          reject(self.error)
        else
          resolve(res)
        _.invoke(self._pluginInstances, "end")

  Request::appendFile = (name, contents, params)->
    @_formData ?= new FormData()
    @_formData.append(name, contents, params)
    @

  Request::promiseBody = -> @promise().get("body")
  Request::promiseText = -> @promise().get("text")

  Request::parseBinary = ->
    @parse((res, fn)->
      res.data = ''
      res.setEncoding("binary")
      res.on 'data', (chunk)->
        res.data += chunk.toString("binary")
      res.on 'end', ->
        fn null, new Buffer(res.data, 'binary')
    ).buffer(true)

  Request::setFields = (fields)->
    for k,v of fields
      @field(k,v)
    @

  superagent.setGlobalPlugins = (@globalPlugins)->

  superagent
