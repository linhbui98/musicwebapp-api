const Author = require('../models/authors.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Author.find({}, function(err, authors) {
                res.json(authors)
              });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    }
};