const mongoose = require('mongoose');
const Like = require('../models/likes.model');
const Post = require('../models/posts.model');
const User = require('../models/users.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            const likes = await Like.find({})
            return res.json(likes)
        } catch (error) {
            res.json(error.message)
        }
    },
    getLikeByPost: async (req, res) => {
        const postId = req.params.postId
        try {
            const likes = await Like.find({
                post: postId
            })
            .populate('user')
            return res.json(likes)
        } catch (error) {
            res.json(error.message)
        }
    },
    createLike: async (req, res) => {
        const userId = req.userId
        const postId = req.params.postId

        const like = new Like({
            _id: new mongoose.Types.ObjectId(),
            post: postId,
            user: userId
        })

        try {

            await like.save()

            // Push like to user collection, post collection
            await User.findOneAndUpdate(
                { _id: userId },
                { $push: { likes: like._id } }
            );
            await Post.findOneAndUpdate(
                { _id: postId },
                { $push: { likes: like._id } }
            );

            return res.json(like);
        } catch (error) {
            res.json(error.message)
        }
    },
    deleteLike: async (req, res) => {
        const postId = req.params.postId
        const userId = req.userId

        try {

            const like = await Like.findOneAndRemove({ user: userId, post: postId })
            
            // Delete likes from users collection, post collection
            await User.findOneAndUpdate(
                { _id: userId },
                { $pull: { likes: like._id } }
            );
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { likes: like._id } }
            );

            return res.json(like)
        } catch (error) {
            res.json(error.message)
        }
    }
};