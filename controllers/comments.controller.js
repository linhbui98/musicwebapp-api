const mongoose = require('mongoose');
const Comment = require('../models/comments.model');
const Post = require('../models/posts.model');
const User = require('../models/users.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Comment.find({}, function (err, comments) {
                res.json(comments)
            });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    },
    getCommentByPost: async (req, res) => {
        const postId = req.params.postId
        try {
            let comments = await Comment.find({
                post: postId
            })
            .populate('user')
            res.json(comments)
        } catch (error) {
            res.json(error.message)
        }
    },
    createComment: async (req, res) => {
        const data = { ...req.body }
        const userId = req.userId
        const postId = req.params.postId

        const comment = new Comment({
            _id: new mongoose.Types.ObjectId(),
            content: data.content,
            post: postId,
            user: userId
        })

        try {

            await comment.save()

            // Push comment to user collection, post collection
            await User.findOneAndUpdate(
                { _id: userId },
                { $push: { comments: comment._id } }
            );
            await Post.findOneAndUpdate(
                { _id: postId },
                { $push: { comments: comment._id } }
            );

            return res.json(comment);
        } catch (error) {
            res.json(error.message)
        }

    },

    deleteComment: async (req, res) => {
        const id = req.params.id
        const userId = req.userId
        try {

            await Comment.findOne({ _id: id })
                .exec(function (err, comment) {
                    if (err) return handleError(err);
                    if (userId.toString() !== comment.user.toString()) {
                        return res.sendStatus(403);
                    }
                });

            const comment = await Comment.remove({ _id: id })

            // Delete comment from users collection, post collection
            await User.findOneAndUpdate(
                { _id: comment.user },
                { $pull: { comments: comment._id } }
            );
            await Post.findOneAndUpdate(
                { _id: comment.post },
                { $pull: { comments: comment._id } }
            );

            return res.json(comment);
        } catch (error) {
            res.json(error.message)
        }
    },
    updateComment: async (req, res) => {
        const userId = req.userId
        const id = req.params.id
        const data = { ...req.body }

        try {
            await Comment.findOne({ _id: id })
                .exec(function (err, comment) {
                    if (err) return handleError(err);
                    if (userId.toString() !== comment.user.toString()) {
                        return res.sendStatus(403);
                    }
                });
            const comment = await Comment.updateOne({ _id: id }, { content: data.content })

            res.json(comment)
        } catch (error) {
            res.json(error.message)
        }

    },
};