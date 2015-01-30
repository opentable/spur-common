module.exports = (_, console)->

  class BaseDelegate

    supportsMethods:(@_methods)->
      for methodName in @_methods
        do(methodName) =>
          @[methodName] = (args...)=>
            @callDelegate(methodName, args)

      @useConsole()

    callDelegate:(methodName, args)->
      return unless @delegate
      if _.isFunction(@delegate[methodName])
        @delegate[methodName].apply(@delegate, args)
      else if _.isFunction(@delegate)
        @delegate(methodName, args)

    useNoop:()->
      @delegate = null

    useConsole:()->
      @delegate = @consoleDelegate

    consoleDelegate:(methodName, args)=>
      prefix = @constructor.name + "##{methodName}: "
      console.log.apply(console, [prefix].concat(args))

    useRecorder:()->
      @delegate = @recorderDelegate

    recorderDelegate:(methodName, args)=>
      @recorded ?= {}
      (@recorded[methodName] ?= []).push(args)

    use:(@delegate)=>
