const Follow = require('../models/follows.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Follow.find({}, function(err, follows) {
                res.json(follows)
              });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    }
};