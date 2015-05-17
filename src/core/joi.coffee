joi = require "joi"

module.exports = (Promise, SpurErrors)->

  validateFn = Promise.promisify(joi.validate)

  joi.validateAsync = (args...)->
    validateFn.apply(joi, args)
      .catch (e)->
        Promise.reject(SpurErrors.ValidationError.create(e.message)
          .setData(e.details))

  return joi
