const mongoose = require('mongoose');
const Playlist = require('../models/playlists.model');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Playlist.find({}, function(err, playlists) {
                res.json(playlists)
              });
        } catch (error) {
            res.json(error.message)
        }
    },
    create: async (req, res) => {
        let data = { ...req.body };
        console.log("req",req.body)
        let playList = new Playlist({
            _id: new mongoose.Types.ObjectId(),
        })
        try {
            playList.save(function (err) {
                if (err) return handleError(err);
                res.json(playList);
            });
        } catch (error) {
            res.json(error.message)
        }
    },
    update: async (req, res) => {

    }
};