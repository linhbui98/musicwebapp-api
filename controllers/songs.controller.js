const path = require('path');
const Song = require('../models/songs.model');
const Post = require('../models/posts.model');
const mongoose = require('mongoose');
const upload = require('../common/upload');
const fs = require('fs');

module.exports = {
    findAll: async (req, res) => {
        try {
            const songs = await Song.find({})
            return res.json(songs)
        } catch (error) {
            res.json(error.message)
        }
    },
    uploadSong: (req, res) => {
        res.send(req.file)
    },
    removeSong: async (req, res) => {
        const songName = req.params.name
        try {
            fs.unlinkSync(path.join(process.cwd(), 'uploads/audios', songName));
            return res.send('success')
        } catch (err) {
            res.json(err)
        }
    },
    playSong: async (req, res) => {
        const songName = req.params.name
        const music = process.cwd() + '/uploads/audios/' + songName;
        const stat = fs.statSync(music);
        range = req.headers.range;
        let readStream;

        if (range !== undefined) {
            const parts = range.replace(/bytes=/, "").split("-");

            const partial_start = parts[0];
            const partial_end = parts[1];

            if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
                return res.sendStatus(500); //ERR_INCOMPLETE_CHUNKED_ENCODING
            }

            const start = parseInt(partial_start, 10);
            const end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
            const content_length = (end - start) + 1;

            res.status(206).header({
                'Content-Type': 'audio/mpeg',
                'Content-Length': content_length,
                'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
            });

            readStream = fs.createReadStream(music, { start: start, end: end });
            let post = await Post.findOne(
                { src: songName }
            )
            post.view = post.view + 1;
            await post.save()
        } else {
            res.header({
                'Content-Type': 'audio/mpeg',
                'Content-Length': stat.size
            });
            readStream = fs.createReadStream(music);
        }
        readStream.pipe(res);
    }
}