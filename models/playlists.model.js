const mongoose = require ('mongoose');

const Schema = mongoose.Schema;


const playlistSchema = Schema(
  {
    name: String,
    songs: [{
      type: Schema.Types.ObjectId,
      ref: 'Song',
    }],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  }
);

module.exports = mongoose.model('Playist', playlistSchema, 'playlists');