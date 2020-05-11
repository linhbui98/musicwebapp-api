const Singer = require('../models/singers.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            const singers = await Singer.find({})
            return res.json(singers)
        } catch (error) {
            res.json(error.message)
        }
    }
};