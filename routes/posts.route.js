var express = require('express');
var postController = require('../controllers/posts.controller');
var router = express.Router();

// get list posts
router.get('/', postController.findAll);
// get posts by id
router.get('/:id', postController.findById);
// create post
router.post('/', postController.createPost);
// update post
router.put('/:id', postController.updatePost);
// save song to playlist
// router.post('/:id/saveToPlaylist', postController.savePostToPlaylist);
// delete post
router.delete('/:id', postController.deletePost);

module.exports = router;