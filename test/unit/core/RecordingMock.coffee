module.exports = ()->

  class RecordingMock

    mockMethods:(methods)->
      for methodName in methods
        do(methodName) =>
          @[methodName+"s"] = []
          @[methodName] = (args...)=>
            @[methodName+"s"].push(args)
