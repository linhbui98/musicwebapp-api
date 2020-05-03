const mongoose = require('mongoose');
const Like = require('../models/likes.model');
const Post = require('../models/posts.model');
const User = require('../models/users.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Like.find({}, function (err, likes) {
                res.json(likes)
            });
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
        // const id = req.params.id
        // const userId = req.userId
        // try {

        //     const like = await Follow.findByIdAndRemove(id);

        //     // Delete follow from users collection
        //     await User.findOneAndUpdate(
        //         { _id: follow.user },
        //         { $pull: { followers: follow._id } }
        //     );
        //     await Post.findOneAndUpdate(
        //         { _id: follow.follower },
        //         { $pull: { post: like._id } }
        //     );

        //     return res.json(follow);
        // } catch (error) {
        //     res.json(error.message)
        // }
    }
};