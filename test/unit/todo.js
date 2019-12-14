const assert = require('chai').assert;
const Todo = require('../../lib/models/todo');

describe('Todo model', () => {

  it('throws error for missing fields', () => {
    const resource = new Todo({});
    const { errors } = resource.validateSync();
    assert.equal(errors.user.kind, 'required');
    assert.equal(errors.date.kind, 'required');
    assert.equal(errors.status.kind, 'required');
  });

  it('throws errors for incorrect data types', () => {
    const resource = new Todo({
      user: {},
      date: {},
      status: {}
    });
    const { errors } = resource.validateSync();
    assert.equal(errors.user.kind, 'ObjectID');
    assert.equal(errors.date.kind, 'Date');
    assert.equal(errors.status.kind, 'String');
  });
});
