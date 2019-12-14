const assert = require('chai').assert;
const User = require('../../lib/models/user');

describe('User model', () => {

it('throws error for missing fields', () => {
  const user = new User({});
  const { errors } = user.validateSync();
  assert.equal(errors.email.kind, 'required');
  assert.equal(errors.hash.kind, 'required');
});

it('throws errors for incorrect data types', () => {
  const user = new User({
    email: {},
    hash: {}
  });
  const { errors } = user.validateSync();
  assert.equal(errors.email.kind, 'String');
  assert.equal(errors.hash.kind, 'String');
});
});
