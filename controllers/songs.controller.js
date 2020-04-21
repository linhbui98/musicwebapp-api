const Song = require('../models/songs.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Song.find({}, function(err, songs) {
                res.json(songs)
              });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    }
};