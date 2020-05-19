const mongoose = require('mongoose');
const Playlist = require('../models/playlists.model');
const Post = require('../models/posts.model');
const User = require('../models/users.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            const playlists = await Playlist.find({})
                .populate('posts')
            return res.json(playlists)
        } catch (error) {
            res.json(error.message)
        }
    },
    findAllForUser: async (req, res) => {
        const userId = req.userId;
        try {
            const playlists = await Playlist.find({ user: userId })
                .populate({
                    path: 'posts',
                })
            playlists.map(playlist => {
                playlist._doc.countSong = playlist.posts.length
            })
            return res.json(playlists)
        } catch (error) {
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
            await playlist.save()
            await User.findOneAndUpdate(
                { user: userId },
                { $push: { playlists: playlist._id } }
            )
            return res.json(playlist);
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
                { new: true }
            )
            if (!playlist) {
                return res.json('You dont have this playlist or playlist not exist!')
            }
            return res.json(playlist)
        } catch (error) {
            res.json(error.message)
        }
    },
    delete: async (req, res) => {
        const userId = req.userId
        const playlistId = req.params.id

        try {
            const playlist = await Playlist.findOneAndRemove(
                { _id: playlistId, user: userId }
            )
            await User.findOneAndUpdate(
                { user: userId },
                { $pull: { playlists: playlist._id } }
            )
            if (!playlist) {
                return res.json('You dont have this playlist or playlist not exist!')
            }
            return res.json(playlist)
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
                { new: true }
            )
            return res.json(playlist)
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
                { new: true }
            )
            return res.json(playlist)
        } catch (error) {
            res.json(error.message)
        }
    },
};