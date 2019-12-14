const router = require('express').Router();
const Todo = require('../models/todo');
const ensureRole = require('../../lib/utils/ensure-role');

module.exports = router

  .post('/',(req, res, next) => {
    req.body.user = req.user.id
    new Todo(req.body).save()
      .then(todo => res.json(todo))
      .catch(next);
  })

  .get('/me', (req, res, next) => {
    Todo.find({ user: req.user.id})
      .populate({ path: 'user', select: 'title _id user'})
      .lean()
      .then(todos =>{
        console.log('sending todos ', todos)
        res.json(todos)
      } )
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Todo.findOne({'_id' : req.params.id, user: req.user.id})
      .populate({ path: 'user', select: 'title user _id' })
      .lean()
      .then(todos => res.json(todos))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    const { id }= req.params;
    const { id: tokenId } = req.user;
    let { title, date, description, user: userId, status } = req.body;
    console.log('deletinggggg', req.body)
    userId = userId._id ? userId._id : userId;
    const isMe = tokenId === userId
    if (!id || !isMe ) {
      console.log('here', tokenId, 'userID: ', userId._id )
      const error = !isMe ?
        { code: 401, error: 'unauthorized'} :
        { code: 404, error: `id ${id} does not exist`}
        console.log('here', error )
        next(err);
    }
    return Todo.findByIdAndRemove(req.params.id)
        .then(result => {
            const isRemoved = result ? true : false;
            return isRemoved;
        })
        .then(isRemoved => res.json({ removed: isRemoved }))
        .catch(next);
  })

  .put('/me/:id', (req, res, next) => {
    const { id }= req.params;
    const { id: tokenId } = req.user;
    let { title, date, description, user: userId, status } = req.body;
    userId = userId._id ? userId._id : userId;
    const isMe = tokenId === userId
    if (!id || !isMe ) {
      console.log('here', tokenId, 'userID: ', userId._id )
      const error = !isMe ?
        { code: 401, error: 'unauthorized'} :
        { code: 404, error: `id ${id} does not exist`}
        console.log('here', error )
        next(err);
    }
    const update = { title, date, description, status };
    Todo.findByIdAndUpdate({ _id: id }, update, { new: true , runValidators: true })
        .lean()
        .then(updatedTodo => res.json(updatedTodo));
  })
