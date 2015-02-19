module.exports = (path, Promise, fsPromise, FixtureCache, Logger)->

  new class FixtureUtil

    constructor:(@fixturesPath)->
      @cache = FixtureCache

    setFixturesPath:(@fixturesPath)->
      Logger.info "Fixtures path changed to: #{@fixturesPath}"

    get:(name)=>
      @cache.getOrPromise name, ()=> @readAndProcessFile(name)

    readAndProcessFile:(name)=>
      @startFileRead(name)
        .then @processText

    startFileRead:(name)=>
      if not @fixturesPath
        return Promise.reject(new Error("fixtures path is not defined"))

      filePath = path.join(@fixturesPath, "#{name}.json")

      Logger.info "Using file fixture: #{filePath}"

      fsPromise
        .readFileAsync(filePath, {encoding: 'utf8'})
        .catch (err)->
          Promise.reject(new Error("#{filePath} not found"))

    processText:(text)->
      JSON.parse(text) if text and text.length > 0
