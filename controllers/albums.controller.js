const Album = require('../models/albums.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Album.find({}, function(err, albums) {
                res.json(albums)
              });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    }
};