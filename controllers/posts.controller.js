const mongoose = require('mongoose');
const Post = require('../models/posts.model');

module.exports = {
    findAll: async (req, res) => {
        const perPage = 5
        const page = Math.max(0, req.param('page'))
        try {
            await Post.find({})
                .populate('song')
                .populate('user')
                .populate('like')
                .populate('comment')
                .limit(perPage)
                .skip(perPage * page)
                .exec(function (err, posts) {
                    if (err) return handleError(err);
                    res.json(posts)
                });
        } catch (error) {
            res.json(error.message)
        }
    },
    createPost: async (req, res) => {
        let data = { ...req.body };
        let post = new Post({
            _id: new mongoose.Types.ObjectId(),
            content: data.content,

        })
        try {
            post.save(function (err, post) {
                if (err) return handleError(err);
                res.json(post);
            });
        } catch (error) {
            res.json(error.message)
        }
    },
    updatePost: async (req, res) => {

    },
    deletePost: async (req, res) => {

    }
};