const path = require('path');
const Song = require('../models/songs.model');
const upload = require('../common/upload');
const fs = require('fs');

module.exports = {
    findAll: async (req, res) => {
        try {
            await Song.find({}, function (err, songs) {
                res.json(songs)
            });
        } catch (error) {
            res.json(error.message)
        }
    },
    uploadSong: async (req, res) => {
        await upload.single('file')(req, res, (error) => {
            if (error) {
                return res.send(`Error when trying to upload: ${error}`);
            }
            // res.sendFile(path.join(process.cwd(), 'uploads', req.file.filename));
            res.send(req.file)
        });
    },
    playSong: async (req, res) => {
        var music = process.cwd() + '/uploads/audios/' + '1588474938586-AnhThanhNien-HuyR-6205741.mp3';

        var stat = fs.statSync(music);
        range = req.headers.range;
        var readStream;

        if (range !== undefined) {
            var parts = range.replace(/bytes=/, "").split("-");

            var partial_start = parts[0];
            var partial_end = parts[1];

            if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
                return res.sendStatus(500); //ERR_INCOMPLETE_CHUNKED_ENCODING
            }

            var start = parseInt(partial_start, 10);
            var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
            var content_length = (end - start) + 1;

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