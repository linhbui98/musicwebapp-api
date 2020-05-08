const mongoose = require('mongoose');
const Playlist = require('../models/playlists.model');
const Post = require('../models/posts.model');
const User = require('../models/users.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Playlist.find({})
                .populate('songs')
                .exec(function (err, playlists) {
                    if (err) return handleError(err);
                    res.json(playlists)
                });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    },
    findAllForUser: async (req, res) => {
        const userId = req.userId;
        try {
            await Playlist.find({ user: userId })
                .populate('songs')
                .exec(function (err, playlists) {
                    if (err) return handleError(err);
                    res.json(playlists)
                });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    },
    create: async (req, res) => {
        const data = { ...req.body };
        const userId = req.userId;
        const playlist = new Playlist({
            _id: new mongoose.Types.ObjectId(),
            name: data.name,
            user: userId
        })
        try {
            playlist.save(function (err) {
                if (err) throw (err)
                res.json(playlist);
            });
            await User.findOneAndUpdate(
                { user: userId },
                { $push: { playlists: playlist._id} }
            )
        } catch (error) {
            res.json(error.message)
        }
    },
    updateName: async (req, res) => {
        const userId = req.userId
        const playlistId = req.params.id
        const data = { ...req.body }

        try {
            const playlist = await Playlist.findOneAndUpdate(
                { _id: playlistId, user: userId },
                { name: data.name },
                { new : true }
            )
            res.json(playlist)
        } catch (error) {
            res.json(error.message)
        }
    },
    delete: async (req, res) => {
        const userId = req.userId
        const playlistId = req.params.id
        const data = { ...req.body }

        try {
            const playlist = await Playlist.findOneAndRemove(
                { _id: playlistId, user: userId }
            )
            await User.findOneAndUpdate(
                { user: userId },
                { $pull: { playlists: playlist._id} }
            )
            res.json(playlist)
        } catch (error) {
            res.json(error.message)
        }
    },
    addPostToPlaylist: async (req, res) => {
        const userId = req.userId
        const postId = req.body.postId
        const playlistId = req.params.id
        try {
            const playlist = await Playlist.findOneAndUpdate(
                { _id: playlistId, user: userId },
                { $push: { posts: postId } },
                { new : true } 
            )
            res.json(playlist)
        } catch (error) {
            res.json(error.message)
        }
    },
    deletePostFromPlaylist: async (req, res) => {
        const userId = req.userId
        const postId = req.body.postId
        const playlistId = req.params.id
        try {
            const playlist = await Playlist.findOneAndUpdate(
                { _id: playlistId, user: userId },
                { $pull: { posts: postId } },
                { new : true } 
            )
            res.json(playlist)
        } catch (error) {
            res.json(error.message)
        }
    },
};