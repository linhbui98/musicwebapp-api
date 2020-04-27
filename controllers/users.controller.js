const mongoose = require('mongoose');
const User = require('../models/users.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await User.find({})
            .populate('posts')
            .populate('likes')
            .populate('comments')
            // .populate('notifications')
            // .populate('following')
            // .populate('followers')
            // .populate('playlists')
            .exec(function (err, users) {
                if (err) return handleError(err);
                res.json(users)
            });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    },
    findById: async (req, res) => {
        try {
            console.log(req.params)
            const userId = req.params.id
            await User.find({ _id: userId })
            .populate('posts')
            .populate('likes')
            .populate('comments')
            // .populate('notifications')
            // .populate('following')
            // .populate('followers')
            // .populate('playlists')
            .exec(function (err, users) {
                if (err) return handleError(err);
                res.json(users)
            });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    },
    createUser: async (req, res) => {
        const data = { ...req.body }
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: data.username,
            password: data.password,
            email: data.email,
            isActive: true,
            fullName: data.fullName,
            playlists: [],
            posts: [],
            likes: [],
            comments: [],
            followers: [],
            following: [],
            notifications: []
        })
        console.log("user", user)
        try {
            user.save(function (err, user) {
                if (err) return handleError(err);
                res.json(user);
            });
        } catch (error) {
            res.json(error.message)
        }
    },
    updateUser: async (req, res) => {
    },
    deleteUser: async (req, res) => {
    }
};