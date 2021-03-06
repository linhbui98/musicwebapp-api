const mongoose = require('mongoose');
const validator = require('validator');

const songSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        source: {
            type: String,
            required: true
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });

const Song = mongoose.model('Song', songSchema, 'songs');
module.exports = Song;
