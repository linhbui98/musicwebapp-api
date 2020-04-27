const mongoose = require ('mongoose');

const Schema = mongoose.Schema;


const postSchema = Schema(
  {
    content: String,
    isDelete: Boolean,
    song: {
      type: Schema.Types.ObjectId,
      ref: 'Song',
    },
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
  }
);

module.exports = mongoose.model('Post', postSchema, 'posts');