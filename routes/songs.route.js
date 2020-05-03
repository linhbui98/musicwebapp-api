var express = require('express');
var songController = require('../controllers/songs.controller');

var router = express.Router();

// get list songs
router.get('/', songController.findAll);

// upload song
router.post('/upload', songController.uploadSong);

// play song
router.get('/play', songController.playSong);

module.exports = router;