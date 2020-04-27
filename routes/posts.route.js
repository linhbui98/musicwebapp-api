var express = require('express');
var postController = require('../controllers/posts.controller');
var router = express.Router();

// get list posts
router.get('/', postController.findAll);
// create post
router.post('/', postController.createPost);
// update post
router.put('/:id', postController.updatePost);
// delete post
router.delete('/:id', postController.deletePost);

module.exports = router;