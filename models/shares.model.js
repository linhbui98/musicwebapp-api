const mongoose = require ('mongoose');

const Schema = mongoose.Schema;


const shareSchema = Schema(
  {
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

module.exports = mongoose.model('Share', shareSchema, 'shares');