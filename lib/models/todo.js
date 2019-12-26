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
    maxlength: [250, 'Cannot exceed 250 characters'],
  },
  title: {
    type: String,
    maxlength: [35, 'Cannot exceed 35 characters'],
    required: [true, 'Invalid title']
  }
});

module.exports = mongoose.model('Todo', schema);
