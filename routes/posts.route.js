var express = require('express');
var postController = require('../controllers/posts.controller');
var router = express.Router();

// get list posts
router.get('/', postController.findAll);
// create post
router.post('/create-post', postController.createPost);
// update post
router.put('/update-post', postController.updatePost);
// delete post
router.put('/update-post', postController.deletePost);

module.exports = router;