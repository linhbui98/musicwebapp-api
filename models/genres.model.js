const mongoose = require ('mongoose');

const Schema = mongoose.Schema;


const genreSchema = Schema(
  {
    tagname: String,
    description: String,
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Genre', genreSchema, 'genres');