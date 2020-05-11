const path = require('path');
const Song = require('../models/songs.model');
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
    uploadSong: async (req, res) => {

        await upload.single('file')(req, res, (error) => {
            if (error) {
                return res.send(`Error when trying to upload: ${error}`);
            }
            console.log('linh')
            // res.sendFile(path.join(process.cwd(), 'uploads', req.file.filename));
            // res.send(req.file)
        });
        console.log('huyy')
        const userId = req.userId
        const name = req.file.originalname
        const source = req.file.filename

        const song = new Song({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            source: source,
            user: userId
        })

        try {
            await song.save(function (err, song) {
                if (err) console.log(err);
                res.json(song);
            });
        } catch (error) {
            res.json(error.message)
        }
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