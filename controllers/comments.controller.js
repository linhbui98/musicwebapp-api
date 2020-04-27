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
    },
    createComment: async (req, res) => {
        const data = { ...req.body }
        const userId = req.userId
      
    },
    updateComment: async (req, res) => {
        const userId = req.userId
        const postId = req.params.id
        const data = { ...req.body }

    },
    deleteComment: async (req, res) => {
       
    }
};