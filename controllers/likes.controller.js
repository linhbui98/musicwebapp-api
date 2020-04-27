const Like = require('../models/likes.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Like.find({}, function(err, likes) {
                res.json(likes)
              });
        } catch (error) {
            res.json(error.message)
        }
    }
};