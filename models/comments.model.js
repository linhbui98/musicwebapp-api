const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = Schema(
  {
    content: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
);

module.exports = mongoose.model('Comment', commentSchema, 'comments');