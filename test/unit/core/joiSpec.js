describe('joi', () => {
  const base = this;

  beforeEach(function () {
    injector()
    .inject(function (joi) {
      base.joi = joi;
      base.schemaDefinition = {
        username: base.joi.string()
          .alphanum()
          .min(3)
          .max(30)
          .required(),
        password: base.joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        access_token: [base.joi.string(), base.joi.number()],
        birthyear: base.joi.number()
          .integer()
          .min(1900)
          .max(2013),
        email: base.joi.string().email()
      };
      base.schema = joi.object()
        .keys(base.schemaDefinition)
        .with('username', 'birthyear')
        .without('password', 'access_token');

      base.validData = { username: 'abc', birthyear: 1994 };
      base.invalidData = { birthyear: 2016 };
    });
  });

  it('should validate with sync', function (done) {
    base.joi.validate(base.validData, base.schema, (err, value) => {
      expect(err).to.equal(null);
      expect(value).to.deep.equal(base.validData);
      done();
    });
  });

  it('should validate with async', function (done) {
    base.joi.validateAsync(base.validData, base.schema)
    .then((data) => {
      expect(data).to.deep.equal(base.validData);
      done();
    });
  });

  it('should reject invalid data through async', function (done) {
    base.joi.validateAsync(base.invalidData, base.schema)
    .catch((error) => {
      expect(error.data[0].message).to.deep.equal('"username" is required');
      done();
    });
  });
});
