const mongoose = require('mongoose');
const Post = require('../models/posts.model');
const User = require('../models/users.model');
const Playist = require('../models/playlists.model');
const Follow = require('../models/follows.model');

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
            return res.json(posts)
        } catch (error) {
            res.json(error.message)
        }
    },
    findById: async (req, res) => {
        const id = req.params.id
        try {
            const post = await Post.find({ _id: id })
                .populate('user')
                .populate('likes')
                .populate('comments')
            return res.json(post)
        } catch (error) {
            res.json(error.message)
        }
    },
    getFollowedPosts: async (req, res) => {
        const userId = req.userId
        // Find user ids, that current user follows
        const userFollowing = [];
        try {
            const follow = await Follow.find({ user: userId }, { _id: 0 }).select(
                'follower'
            );
            follow.map(f => userFollowing.push(f.user));

            // // Find user posts and followed posts by using userFollowing ids array
            const query = {
                $or: [{ author: { $in: userFollowing } }, { author: userId }],
            };
            const followedPostsCount = await Post.find(query).countDocuments();
            const followedPosts = await Post.find(query)
                .populate({
                    path: 'user',
                    populate: [
                        { path: 'following' },
                        { path: 'followers' },
                        // {
                        //     path: 'notifications',
                        //     populate: [
                        //         { path: 'author' },
                        //         { path: 'follow' },
                        //         { path: 'like' },
                        //         { path: 'comment' },
                        //     ],
                        // },
                    ],
                })
                .populate('likes')
                .populate({
                    path: 'comments',
                    options: { sort: { createdAt: 'desc' } },
                    populate: { path: 'user' },
                })
                .sort({ createdAt: 'desc' });
            return res.json({ posts: followedPosts, count: followedPostsCount });
        } catch (err) {
            res.json(err.message)
        }

    },
    createPost: async (req, res) => {
        const data = { ...req.body }
        const userId = req.userId
        const post = new Post({
            _id: new mongoose.Types.ObjectId(),
            src: data.src,
            name: data.name,
            description: data.description,
            user: userId
        })
        try {
            await post.save()
            return res.json(post);
        } catch (error) {
            res.json(error.message)
        }
    },
    updatePost: async (req, res) => {
        const userId = req.userId
        const postId = req.params.id
        const data = { ...req.body }

        try {
            const post = await Post.findOneAndUpdate(
                { user: userId, _id: postId },
                { content: data.content },
                { new: true }
            );
            if (!post) {
                return res.json('You dont have this post or post not exist!')
            }
            return res.json(post)
        } catch (error) {
            res.json(error.message)
        }
    },
    deletePost: async (req, res) => {
        const userId = req.userId
        const postId = req.params.id

        try {
            const post = await Post.findOneAndDelete(
                { user: userId, _id: postId }
            );
            if (!post) {
                return res.json('You dont have this post or post not exist!')
            }
            return res.json(post)
        } catch (error) {
            res.json(error.message)
        }
    }
};