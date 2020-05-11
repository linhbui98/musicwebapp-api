const mongoose = require('mongoose');
const Post = require('../models/posts.model');
const User = require('../models/users.model');
const Playist = require('../models/playlists.model');

module.exports = {
    findAll: async (req, res) => {
        const userId = req.userId
        const perPage = 5
        const page = req.query.page || 1
        try {
            let posts = await Post.find({})
                .populate('song')
                .populate('user')
                .populate('likes')
                .populate('comments')
                .limit(perPage)
                .skip(perPage * (page - 1))

            posts = posts.map(post => {
                let likes = post.likes.filter(like => {
                    return like.user == userId;
                })
                likes.length === 1 ? post._doc.isLike = true : post._doc.isLike = false

                post._doc.countLike = post.likes.length
                post._doc.countComment = post.comments.length
                return post;
            })
            res.json(posts)
        } catch (error) {
            res.json(error.message)
        }
    },
    findById: async (req, res) => {
        const id = req.params.id
        try {
            await Post.find({ _id: id })
                .populate('song')
                .populate('user')
                .populate('likes')
                .populate('comments')
                .exec(function (err, post) {
                    if (err) return handleError(err);
                    res.json(post)
                });
        } catch (error) {
            res.json(error.message)
        }
    },
    // savePostToPlaylist: async (req, res) => {
    //     const userId = req.userId
    //     const playlistId = req.body.playlistId
    //     const postId = req.params.id

    //     try {
    //         const post = await Post.findOne({ _id: postId })
    //         const playlist = await Playist.findOneAndUpdate(
    //             { _id: playlistId, user: userId },
    //             { $push: { posts: postId } }
    //         )
    //         res.json(playlist)
    //     } catch (error) {
    //         res.json(error.message)
    //     }
    // },
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
            await Post.findOne({ _id: postId })
                .populate('user')
                .exec(function (err, post) {
                    if (err) return handleError(err);
                    if (userId.toString() !== post.user._id.toString()) {
                        return res.sendStatus(403);
                    }
                });
            await Post.updateOne({ _id: postId }, { content: data.content }, function (err, post) {
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
            await Post.findOne({ _id: postId })
                .populate('user')
                .exec(function (err, post) {
                    if (err) return handleError(err);
                    if (userId.toString() !== post.user._id.toString()) {
                        return res.sendStatus(403);
                    }
                });
            await Post.deleteOne({ _id: postId }, function (err, post) {
                if (err) return handleError(err);
                res.json(post)
            });
        } catch (error) {
            res.json(error.message)
        }
    }
};