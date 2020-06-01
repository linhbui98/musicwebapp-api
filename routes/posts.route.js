var express = require('express');
var postController = require('../controllers/posts.controller');
var router = express.Router();

// get list posts
router.get('/', postController.findAll);
// get posts by id
// router.get('/:id', postController.findById);
// get posts user follow
router.get('/follow', postController.getFollowedPosts);
// get posts by user post
router.post('/:userId', postController.getUserPosts);
// get posts by user like
router.get('/like', postController.getUserLikePosts);
// get posts by popular
router.get('/popular', postController.getPopularPosts);
// get posts by popular
router.get('/genre/:genreId', postController.getGenrePosts);
// create post
router.post('/', postController.createPost);
// update post
router.put('/:id', postController.updatePost);
// delete post
router.delete('/:id', postController.deletePost);

module.exports = router;