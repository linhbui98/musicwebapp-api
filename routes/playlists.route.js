var express = require('express');
var playistController = require('../controllers/playlists.controller');
var router = express.Router();

// get list playlists
router.get('/', playistController.findAll);

module.exports = router;