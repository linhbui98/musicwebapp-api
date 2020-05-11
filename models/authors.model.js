const mongoose = require ('mongoose');

const Schema = mongoose.Schema;


const authorSchema = Schema(
  {
    name: String,
    songs: {
      type: Schema.Types.ObjectId,
      ref: 'Song',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Author', authorSchema, 'authors');