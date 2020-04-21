const User = require('../models/users.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            console.log("huy", User)
            await User.find({}, function(err, users) {
                console.log("kinh")
                res.json(users)
              });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    }
};