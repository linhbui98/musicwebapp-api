const Singer = require('../models/singers.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Singer.find({}, function(err, singers) {
                res.json(singers)
              });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    }
};