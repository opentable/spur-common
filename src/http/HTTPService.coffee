module.exports = (superagent, Promise, _, SpurErrors, FormData)->
  Request = superagent.Request

  superagent.globalPlugins = []

  Request::plugin = (plugin)->
    (@_plugins ?= []).push(plugin)
    @
  Request::named = (@name)-> @

  Request::getDefaultName = ->
    return @url.match(/\/\/(.+)\/?/)[1].replace(/\./g, "_")

  Request::promise = ->
    self = this
    self.name ?= @getDefaultName()
    @_plugins = (@_plugins or []).concat(superagent.globalPlugins)
    @_pluginInstances = _.compact _.map @_plugins, (p)->
      p.start(self)

    return new Promise (resolve, reject)->
      Request::end.call self, (err, res)->
        self.response = res
        if err
          self.error = SpurErrors.InternalServerError.create("HTTP Error", err)
        else if res.status >= 400
          self.error = SpurErrors.errorByStatusCode(res.status)?.create()
          unless self.error
            self.error = SpurErrors.InternalServerError("HTTP Error")

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

  superagent.setGlobalPlugins = (@globalPlugins)->

  superagent


