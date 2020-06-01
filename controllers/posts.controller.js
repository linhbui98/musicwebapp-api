const mongoose = require('mongoose');
const Post = require('../models/posts.model');
const User = require('../models/users.model');
const Genre = require('../models/genres.model');
const Follow = require('../models/follows.model');

module.exports = {
    findAll: async (req, res) => {
        const userId = req.userId
        const perPage = 5
        const page = req.query.page || 1
        try {
            let posts = await Post.find({})
                .populate('user')
                .populate('likes')
                .populate('comments')
                .sort({ createdAt: 'desc' })
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
    getUserPosts: async (req, res) => {
        const userId = req.params.userId
        const perPage = 5
        const page = req.query.page || 1
        try {
            let posts = await Post.find({ user: userId })
                .populate('user')
                .populate('likes')
                .populate('comments')
                .sort({ createdAt: 'desc' })
                .limit(perPage)
                .skip(perPage * (page - 1))
            posts = posts.map(post => {
                let likes = post.likes.filter(like => {
                    return like.user == req.userId;
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
    getUserLikePosts: async (req, res) => {
        const userId = req.userId
        const perPage = 5
        const page = req.query.page || 1
        try {
            let posts = await Post.find({})
                .populate('user')
                .populate('likes')
                .populate('comments')
                .sort({ createdAt: 'desc' })
                .limit(perPage)
                .skip(perPage * (page - 1))
            posts = posts.filter(post => {
                let likes = post.likes.filter(like => {
                    return like.user == userId;
                })
                return likes.length;
            })
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
    getFollowedPosts: async (req, res) => {
        const userId = req.userId
        // Find user ids, that current user follows
        const userFollowing = [];
        try {
            const follows = await Follow.find({ user: userId }, { _id: 0 }).select(
                'follower'
            );
            follows.map(f => userFollowing.push(f.follower));
            // Find user posts and followed posts by using userFollowing ids array
            const query = {
                $or: [{ user: { $in: userFollowing } }, { user: userId }],
            };
            const followedPostsCount = await Post.find(query).countDocuments();
            let followedPosts = await Post.find(query)
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
            followedPosts = followedPosts.map(post => {
                let likes = post.likes.filter(like => {
                    return like.user == userId;
                })
                likes.length === 1 ? post._doc.isLike = true : post._doc.isLike = false

                post._doc.countLike = post.likes.length
                post._doc.countComment = post.comments.length
                return post;
            })
            return res.json({ posts: followedPosts, count: followedPostsCount });
        } catch (err) {
            res.json(err.message)
        }

    },
    getPopularPosts: async (req, res) => {
        const userId = req.userId
        try {
            let posts = await Post.find({})
                .populate('user')
                .populate('likes')
                .populate('comments')
                .sort({ view: 'desc' })
                .limit(5);
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
    getGenrePosts: async (req, res) => {
        const userId = req.userId
        const genreId = req.params.genreId
        const perPage = 4
        const page = req.query.page || 1
        try {
            const query = {
                genres: { $all: genreId }
            }
            let posts = await Post.find(query)
                .populate('genres')
                .populate('user')
                .populate('likes')
                .populate('comments')
                .sort({ view: 'desc' })
                .limit(perPage)
                .skip(perPage * (page - 1));
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
    createPost: async (req, res) => {
        const data = { ...req.body }
        const userId = req.userId
        const post = new Post({
            _id: new mongoose.Types.ObjectId(),
            src: data.src,
            name: data.name,
            genres: data.genres,
            description: data.description,
            user: userId
        })
        try {

            await post.save()
            await Genre.updateMany(
                {
                    _id: { $in: data.genres }
                },
                {
                    $push: { posts: post._id }
                }
            )
            await User.findOneAndUpdate(
                { _id: userId },
                { $push: { posts: post._id } }
            );

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
                { description: data.description },
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
            await User.findOneAndUpdate(
                { _id: userId },
                { $pull: { posts: postId } }
            );
            return res.json(post)
        } catch (error) {
            res.json(error.message)
        }
    }
};