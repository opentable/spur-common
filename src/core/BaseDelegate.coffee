module.exports = (_, console, consoleColors)->

  class BaseDelegate

    supportsMethods:(@_methods)->
      for methodName in @_methods
        do(methodName) =>
          @[methodName] = (args...)=>
            @callDelegate(methodName, args)

      @useConsole()

    callDelegate:(methodName, args)->
      _.each @delegates, (delegate)=>
        if _.isFunction(delegate[methodName])
          delegate[methodName].apply(delegate, args)
        else if _.isFunction(delegate)
          delegate.call(@, methodName, args)

    useNoop:()->
      @delegates = []

    useConsole:()->
      @delegates = [@consoleDelegate]

    consoleDelegate:(methodName, args)=>
      prefix = @getColoredLabel(methodName)
      console.log.apply(console, [prefix].concat(args))

    getColoredLabel: (methodName)->
      label = "#{@constructor.name}##{methodName}: "

      if _.contains(["fatal", "error"], methodName)
        color = "red"
      else if _.contains(["warn"], methodName)
        color = "yellow"

      consoleColors[color or "cyan"](label)

    useRecorder:()->
      @delegates = [@recorderDelegate]

    recorderDelegate:(methodName, args)=>
      @recorded ?= {}
      (@recorded[methodName] ?= []).push(args)

    use:(delegate)=>
      @delegates = [delegate]
