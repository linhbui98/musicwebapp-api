const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const albumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    songs: {
        type: ObjectId,
        ref: 'Song'
    },
    singers:{
        type: ObjectId,
        ref: 'Singer'
    }
});

module.exports = mongoose.model('Album', albumSchema, 'albums');
