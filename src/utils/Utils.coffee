module.exports = (_, Promise)->


  new class Utils

    prop:(prop)-> (ob)-> ob[prop]

    extendWith:(ob1)-> (ob2)-> _.extend(ob2, ob1)

    capitalize:(str)->
      return "" unless str
      str.charAt(0).toUpperCase() + str.substring(1)

    identity:(val)-> ()-> val

    mapObject:(ob, fn)->
      newOb = {}
      for k, v of ob
        newOb[k] = fn(v)
      newOb

    deepClone:(ob)->
      JSON.parse(JSON.stringify(ob))

    promiseQueue:(fns)->
      queue = Promise.resolve(true)
      for fn in fns
        queue = queue.then(fn)
      queue
