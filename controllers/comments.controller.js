const Comment = require('../models/comments.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Comment.find({}, function(err, comments) {
                res.json(comments)
              });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    }
};