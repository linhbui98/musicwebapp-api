const Like = require('../models/likes.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Like.find({}, function(err, likes) {
                res.json(likes)
              });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    }
};