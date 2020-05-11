var express = require('express');
var songController = require('../controllers/songs.controller');
const upload = require('../common/upload');

var router = express.Router();

// get list songs
router.get('/', songController.findAll);

// upload song
router.post('/upload', upload.single('file'), songController.uploadSong);

// remove song
router.delete('/:name/remove', songController.removeSong);

// play song
router.get('/:name/play', songController.playSong);

module.exports = router;