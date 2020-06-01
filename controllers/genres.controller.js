const Genre = require('../models/genres.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            const genres = await Genre.find({})
                .populate('posts')
            return res.json(genres)
        } catch (error) {
            res.json(error.message)
        }
    },
};