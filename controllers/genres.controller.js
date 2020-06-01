const Genre = require('../models/genres.model');

module.exports = {
    findAll: async (req, res) => {
        const perPage = 3
        const page = req.query.page || 1
        try {
            const genres = await Genre.find({})
                .limit(perPage)
                .skip(perPage * (page - 1))
            return res.json(genres)
        } catch (error) {
            res.json(error.message)
        }
    },
};