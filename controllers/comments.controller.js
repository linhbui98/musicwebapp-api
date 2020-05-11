const mongoose = require('mongoose');
const Comment = require('../models/comments.model');
const Post = require('../models/posts.model');
const User = require('../models/users.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            const comments = await Comment.find({})
            return res.json(comments)
        } catch (error) {
            res.json(error.message)
        }
    },
    getCommentByPost: async (req, res) => {
        const postId = req.params.postId
        const perPage = 3
        const page = req.query.page || 1
        try {
            const comments = await Comment.find({
                post: postId
            })
                .populate('user')
                .limit(perPage)
                .skip(perPage * (page - 1))
            return res.json(comments)
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
            const comment = await Comment.findOneAndDelete(
                { user: userId, _id: id }
            );

            // Delete comment from users collection, post collection
            await User.findOneAndUpdate(
                { _id: comment.user },
                { $pull: { comments: comment._id } }
            );
            await Post.findOneAndUpdate(
                { _id: comment.post },
                { $pull: { comments: comment._id } }
            );
            if (!comment) {
                return res.json('You dont have this comment or comment not exist!')
            }
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
            const comment = await Comment.findOneAndUpdate(
                { _id: id },
                { content: data.content },
                { new: true }
            );
            if (!comment) {
                return res.json('You dont have this comment or comment not exist!')
            }
            return res.json(comment)
        } catch (error) {
            res.json(error.message)
        }

    },
};