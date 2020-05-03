const mongoose = require('mongoose');
const Post = require('../models/posts.model');
const User = require('../models/users.model');

module.exports = {
    findAll: async (req, res) => {
        const perPage = 5
        const page = req.query.page || 1
        try {
            await Post.find({})
                .populate('song')
                .populate('user')
                // .populate('likes')
                // .populate('comments')
                .limit(perPage)
                .skip(perPage * (page-1))
                .exec(function (err, posts) {
                    if (err) return handleError(err);
                    res.json(posts)
                });
        } catch (error) {
            res.json(error.message)
        }
    },
    createPost: async (req, res) => {
        const data = { ...req.body }
        const userId = req.userId
        const post = new Post({
            _id: new mongoose.Types.ObjectId(),
            content: data.content,
            user: userId
        })
        try {
            await post.save(function (err, post) {
                if (err) return handleError(err);
                res.json(post);
            });
        } catch (error) {
            res.json(error.message)
        }
    },
    updatePost: async (req, res) => {
        const userId = req.userId
        const postId = req.params.id
        const data = { ...req.body }

        try {
            await Post.findOne({ _id: postId})
                .populate('user')
                .exec(function (err, post) {
                    if (err) return handleError(err);
                    if (userId.toString() !== post.user._id.toString()){
                        return res.sendStatus(403);
                    }
                });
            Post.updateOne({ _id: postId }, { content: data.content }, function (err, post) {
                if (err) return handleError(err);
                res.json(post)
            });
        } catch (error) {
            res.json(error.message)
        }
    },
    deletePost: async (req, res) => {
        const userId = req.userId
        const postId = req.params.id

        try {
            await Post.findOne({ _id: postId})
                .populate('user')
                .exec(function (err, post) {
                    if (err) return handleError(err);
                    if (userId.toString() !== post.user._id.toString()){
                        return res.sendStatus(403);
                    }
                });
            Post.deleteOne({ _id: postId }, function (err, post) {
                if (err) return handleError(err);
                res.json(post)
            });
        } catch (error) {
            res.json(error.message)
        }
    }
};