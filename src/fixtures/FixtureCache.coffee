module.exports = (Promise)->

  new class FixtureCache

    constructor:()->
      @cache = {}

    set:(key, value)=> @cache[key] = value

    get:(key)=> @cache[key]

    getOrPromise:(key, fn)=>
      cacheHit = @cache[key]

      if cacheHit
        return Promise.resolve(cacheHit)
      else
        return fn().then (result)=>
          @setAsync(key, result)
          return result

    setAsync:(key, value)-> setTimeout =>
      @set(key, value)
