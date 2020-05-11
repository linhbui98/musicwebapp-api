const mongoose = require ('mongoose');

const Schema = mongoose.Schema;


const singerSchema = Schema(
  {
    name: String,
    songs: {
      type: Schema.Types.ObjectId,
      ref: 'Song',
    },
    albums: {
      type: Schema.Types.ObjectId,
      ref: 'Album',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Singer', singerSchema, 'singers');