describe('joi', () => {
  beforeEach(function () {
    injector()
    .inject((joi) => {
      this.joi = joi;
      this.schemaDefinition = {
        username: this.joi.string()
          .alphanum()
          .min(3)
          .max(30)
          .required(),
        password: this.joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        access_token: [this.joi.string(), this.joi.number()],
        birthyear: this.joi.number()
          .integer()
          .min(1900)
          .max(2013),
        email: this.joi.string().email()
      };
      this.schema = joi.object()
        .keys(this.schemaDefinition)
        .with('username', 'birthyear')
        .without('password', 'access_token');

      this.validData = { username: 'abc', birthyear: 1994 };
      this.invalidData = { birthyear: 2016 };
    });
  });

  it('should validate with sync', function (done) {
    this.joi.validate(this.validData, this.schema, (err, value) => {
      expect(err).to.equal(null);
      expect(value).to.deep.equal(this.validData);
      done();
    });
  });

  it('should validate with async', function (done) {
    this.joi.validateAsync(this.validData, this.schema)
    .then((data) => {
      expect(data).to.deep.equal(this.validData);
      done();
    });
  });

  it('should reject invalid data through async', function (done) {
    this.joi.validateAsync(this.invalidData, this.schema)
    .catch((error) => {
      expect(error.message).to.deep.equal('username is required');
      done();
    });
  });
});
