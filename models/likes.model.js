const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const likeSchema = Schema(
  {
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

module.exports = mongoose.model('Like', likeSchema, 'likes');