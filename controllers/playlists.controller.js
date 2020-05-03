const mongoose = require('mongoose');
const Playlist = require('../models/playlists.model');

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
    create: async (req, res) => {
        let data = { ...req.body };
        let playList = new Playlist({
            _id: new mongoose.Types.ObjectId(),
        })
        try {
            playList.save(function (err) {
                if (err) throw (err)
                res.json(playList);
            });
        } catch (error) {
            res.json(error.message)
        }
    },
    update: async (req, res) => {

    }
};