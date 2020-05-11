const Author = require('../models/authors.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            const authors = await Author.find({})
            return res.json(authors)
        } catch (error) {
            res.json(error.message)
        }
    }
};