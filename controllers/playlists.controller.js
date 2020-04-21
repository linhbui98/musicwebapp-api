const Playlist = require('../models/playlists.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Playlist.find({}, function(err, playlists) {
                res.json(playlists)
              });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    }
};