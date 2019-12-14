const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const requiredString = { type: String, required: true }

const schema = new Schema({
  email: requiredString,
  hash: requiredString,
  firstName: requiredString,
  lastName: requiredString,
  password: String,
  roles: Array
})

schema.statics.emailExists = function(email) {
  return this.find({ email })
    .count()
    .then(count => count > 0);
};

schema.method('generateHash', function (password) {
  this.hash = bcrypt.hashSync(password, 8);
});

schema.method('comparePassword', function (password) {
  return bcrypt.compareSync(password, this.hash);
});

module.exports = mongoose.model('User', schema);
