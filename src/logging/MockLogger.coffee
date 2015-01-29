module.exports  = (RecordingMock)->

  new class MockLogger extends RecordingMock

    constructor:()->
      @mockMethods [
        "fatal"
        "error"
        "warn"
        "info"
        "log"
        "debug"
        "verbose"
      ]
