const chai = require('chai');
const mongoose = require('mongoose');
const request = require('./request');
const assert = chai.assert;

describe('Todo API', () => {

let token1 = '';
let token2 = '';
let userId1 = '';
const testTodo = [
  {
    title: 'Get groceries',
    date: new Date(2018, 11, 24, 10, 33, 30, 0),
    status: 'todo'
  },
  {
    title: 'Get groceries',
    date: new Date(2018, 11, 24, 10, 33, 30, 0),
    status: 'todo',
    description: 'Bananas, Milk, Bread'
  },
  {
    title: 'Pay bills',
    date: new Date(2018, 11, 24, 10, 33, 30, 0),
    status: 'todo',
    description: 'comcast, electric, rent'
  }
];
beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(() => {
  return Promise.all([
    request.post('/api/auth/')
      .send({
        firstName: 'test',
        lastName: '1',
        email: 'test1@test.com',
        password: 'password',
      })
      .then(({ body })  => token1 = body ),
    request.post('/api/auth/')
      .send({
        firstName: 'test',
        lastName: '2',
        email: 'test2@test.com',
        password: 'password'
      })
      .then(({ body })  => token2 = body )
  ]);
});

beforeEach(() => {
  return request.get('/api/auth/verify')
      .set('Authorization', token1)
      .then(({ body })  => userId1 = body)
})

it('Should save a todo with an id', () => {
  return request.post('/api/todos')
    .set('Authorization', token1)
    .send(testTodo[0])
    .then(({ body: savedTodo}) => {
      assert.ok(savedTodo._id);
      assert.ok(savedTodo.title);
      assert.equal(savedTodo.title, testTodo[0].title);
      assert.equal(savedTodo.user, userId1);
    });
});

it('Should get only my todos', () => {
  return Promise.all([
    request.post('/api/todos')
      .set('Authorization', token1)
      .send(testTodo[0])
      .then(({ body: savedTodo }) => savedTodo),
    request.post('/api/todos')
      .set('Authorization', token2)
      .send(testTodo[1])
      .then(({ body: savedTodo }) => savedTodo),
  ])
    .then(savedTodos => {
      return request.get('/api/todos/me')
        .set('Authorization', token1)
        .then(({ body: gotTodos}) => {
          assert.deepEqual(savedTodos[0]._id, gotTodos[0]._id);
          assert.equal(gotTodos.length, 1)
        });
    });
});

it('Should get a todo by id with token', () => {
  return request.post('/api/todos')
    .set('Authorization', token1)
    .send(testTodo[0])
    .then(({ body: savedTodo }) => {
      return request.get(`/api/todos/${savedTodo._id}`)
        .set('Authorization', token1)
        .then(({ body: gotTodo }) => {
          assert.deepEqual(gotTodo._id, savedTodo._id)
        })
    });
})

it('Should delete my todo with token', () => {
  return request.post('/api/todos')
  .set('Authorization', token1)
  .send(testTodo[0])
  .then(({ body: savedTodo }) => {
    return request.delete(`/api/todos/${savedTodo._id}`)
      .set('Authorization', token1)
      .send(savedTodo)
      .then(({ body: deleteResponse }) => {
        return request.get(`/api/todos/${savedTodo._id}`)
        .set('Authorization', token1)
        .then(({ body: gotTodo }) => {
          console.log('gotTodo: ', gotTodo);
          assert.deepEqual(gotTodo, null);
        });
      });
    });
})

it('Should update my todo by id', () => {
    return request.post('/api/todos')
        .set('Authorization', token2)
        .send(testTodo[0])
        .then(({ body: savedTodo }) => savedTodo)
        .then(savedTodo => {
            testTodo[1].user = savedTodo.user;
            return request.put(`/api/todos/me/${savedTodo._id}`)
                .set('Authorization', token2)
                .send(testTodo[1]);
        })
        .then(({ body: updatedTodo }) => {
            console.log('updatedTodo: ', updatedTodo)
            assert.deepEqual(updatedTodo.service, testTodo[1].service);
            assert.deepEqual(updatedTodo.status, testTodo[0].status);
        });
});

})
