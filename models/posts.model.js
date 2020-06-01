const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const postSchema = Schema(
  {
    isDelete: Boolean,
    src: String,
    name: String,
    description: String,
    genres: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Genre',
      }
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Like',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    view: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Post', postSchema, 'posts');