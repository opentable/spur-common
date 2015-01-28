module.exports = (superagent, Promise, SpurErrors)->

  Request = superagent.Request

  Request::promise = ->
    return new Promise (resolve, reject)=>
      Request::end.call @, (err, res)->

        try

          if err
            return reject(SpurErrors.InternalServerError.create("HTTP Error", err))
          else if res.status >= 400
            error = SpurErrors.errorByStatusCode(res.status)?.create()
            unless error
              error = SpurErrors.InternalServerError("HTTP Error")
            error.setData({text:res.text})
            return reject(error)

          return resolve(res)

        catch e
          return reject(e)

  Request::promiseBody = -> @promise().get("body")
  Request::promiseText = -> @promise().get("text")

  superagent
