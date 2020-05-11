const Album = require('../models/albums.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            const albums = await Album.find({})
            return res.json(albums)
        } catch (error) {
            res.json(error.message)
        }
    }
};