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
                .populate('following')
                .populate('followers')
                .populate('playlists')
                 // .populate('notifications')
            const condition = user.followers.find(user => {
                return user.user == userId
            })
            console.log(userId)
            if(condition){
                user._doc.isFollow = true
            }else {
                user._doc.isFollow = false
            }
            return res.json(user)

        } catch (error) {
            res.json(error.message)
        }
    },
    getProfile: async (req, res) => {
        const userId = req.userId
        console.log(userId)
        // try {
        //     await User.findOne({ _id: userId, isActive: true })
        //     .exec(function (err, users) {
        //         if (err) console.log("err", err)
        //         res.json(users)
        //     });
        // } catch (error) {
        //     res.json(error.message)
        // }
    },
    // createUser: async (req, res) => {
    //     const data = { ...req.body }
    //     const user = new User({
    //         _id: new mongoose.Types.ObjectId(),
    //         username: data.username,
    //         password: data.password,
    //         email: data.email,
    //         isActive: true,
    //         fullName: data.fullName,
    //         playlists: [],
    //         posts: [],
    //         likes: [],
    //         comments: [],
    //         followers: [],
    //         following: [],
    //         notifications: []
    //     })
    //     // console.log("user", user)
    //     try {
    //         user.save(function (err, user) {
    //             if (err) throw (err)
    //             res.json(user);
    //         });
    //     } catch (error) {
    //         res.json(error.message)
    //     }
    // },
    inactiveUser: async (req, res) => {
        const id = req.userId
        try {

            const user = await User.findOneAndUpdate(
                { _id: id },
                { isActive: false },
                { new: true}
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
                { new: true}
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
        const data = { ...req.body }
        try {

            const user = await User.findOneAndUpdate(
                { _id: id },
                { avatar: data.avatar },
                { new: true}
            );
            return res.json(user)

        } catch (error) {
            res.json(error.message)
        }
    },
    updateUser: async => {

    }
};