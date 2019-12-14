const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requiredString = { type: String, required: true }

const schema = new Schema({
  user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-porgress', 'resolved'],
    required: true
  },
  description: {
    type: String,
  },
  title: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Todo', schema);
