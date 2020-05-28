const mongoose = require('mongoose');
const User = require('../models/users.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            const users = await User.find({ isActive: true })
                .populate('posts')
                .populate('likes')
                .populate('comments')
                .populate('following')
                .populate('followers')
                .populate('playlists')
            // .populate('notifications')
            return res.json(users)
        } catch (error) {
            res.json(error.message)
        }
    },
    findByUsername: async (req, res) => {
        const userId = req.userId
        const username = req.params.username
        try {
            let user = await User.findOne({ username: username, isActive: true })
                .populate('posts')
                .populate('likes')
                .populate('comments')
                .populate({
                    path: 'following',
                    populate: [
                        { path: 'user' },
                        { path: 'follower' }
                    ]
                })
                .populate({
                    path: 'followers',
                    populate: [
                        { path: 'user' },
                        { path: 'follower' }
                    ]
                })
                .populate({
                    path: 'playlists',
                    populate: [
                        { path: 'posts' }
                    ]
                })
            // .populate('notifications')
            if (!user) {
                return res.json({ message: 'User not found'})   
            }
            const condition = user.followers.find(user => {
                return user.user == userId
            })
            if (condition) {
                user._doc.isFollow = true
            } else {
                user._doc.isFollow = false
            }
            return res.json(user)

        } catch (error) {
            res.json(error.message)
        }
    },
    inactiveUser: async (req, res) => {
        const id = req.userId
        try {

            const user = await User.findOneAndUpdate(
                { _id: id },
                { isActive: false },
                { new: true }
            );
            return res.json(user);

        } catch (error) {
            res.json(error.message)
        }
    },
    reactiveUser: async (req, res) => {
        const id = req.userId
        try {

            const user = await User.findOneAndUpdate(
                { _id: id },
                { isActive: true },
                { new: true }
            );
            return res.json(user);

        } catch (error) {
            res.json(error.message)
        }
    },
    deleteUserForever: async (req, res) => {
        const id = req.userId
        try {
            const user = await User.findByIdAndRemove(id);
            return res.json(user)

        } catch (error) {
            res.json(error.message)
        }
    },
    changeAvatar: async (req, res) => {
        const id = req.userId
        const data = { ...req.file }
        try {

            const user = await User.findOneAndUpdate(
                { _id: id },
                { avatar: data.filename },
                { new: true }
            );
            return res.json(user)

        } catch (error) {
            res.json(error.message)
        }
    },
    changeCover: async (req, res) => {
        const id = req.userId
        const data = { ...req.file }
        try {

            const user = await User.findOneAndUpdate(
                { _id: id },
                { cover: data.filename },
                { new: true }
            );
            return res.json(user)

        } catch (error) {
            res.json(error.message)
        }
    },
    updateUser: async => {

    }
};