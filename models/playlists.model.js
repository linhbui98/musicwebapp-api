const mongoose = require ('mongoose');

const Schema = mongoose.Schema;


const playlistSchema = Schema(
  {
    name: String,
    songs: [{
      type: Schema.Types.ObjectId,
      ref: 'Song',
    }],
    posts: [{
      type: Schema.Types.ObjectId,
      ref: 'Post',
    }],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Playist', playlistSchema, 'playlists');