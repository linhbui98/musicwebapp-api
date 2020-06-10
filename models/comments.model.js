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
      required: true,
      ref: 'User',
    },
    stream: {
      type: Schema.Types.ObjectId,
      ref: 'Stream',
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Comment', commentSchema, 'comments');