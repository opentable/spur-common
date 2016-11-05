import joi from 'joi';

module.exports = function (Promise, SpurErrors) {
  const validateFn = Promise.promisify(joi.validate);

  joi.validateAsync = function (...args) {
    return validateFn.apply(joi, args)
      .catch((e) => {
        const error = SpurErrors.ValidationError
          .create(e.message)
          .setData(e.details);

        return Promise.reject(error);
      });
  };

  return joi;
};
