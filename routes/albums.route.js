var express = require('express');
var albumController = require('../controllers/albums.controller');
var router = express.Router();

// get list albums
router.get('/', albumController.findAll);

module.exports = router;