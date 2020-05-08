var express = require('express');
var playistController = require('../controllers/playlists.controller');
var router = express.Router();

// get list playlists
router.get('/', playistController.findAll);

// get list playlists for user
router.get('/forUser', playistController.findAllForUser);

// create playlist
router.post('/', playistController.create);

// update name playlist
router.put('/:id', playistController.updateName);

// delete playlist
router.delete('/:id', playistController.delete);

// delete post from playlist
router.put('/:id/addPostToPlaylist', playistController.addPostToPlaylist);

// delete post from playlist
router.put('/:id/deletePostFromPlaylist', playistController.deletePostFromPlaylist);

module.exports = router;