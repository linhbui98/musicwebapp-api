const Post = require('../models/posts.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Post.find({}, function(err, posts) {
                res.json(posts)
              });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    }
};