const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const followSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Follow', followSchema, 'follows');