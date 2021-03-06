var express = require('express');
var likeController = require('../controllers/likes.controller');
var router = express.Router();

// get list likes
router.get('/', likeController.findAll);

// list like by post
router.get('/:postId', likeController.getLikeByPost);

// get list likes
router.post('/:postId', likeController.createLike);

// get list likes
router.delete('/:postId', likeController.deleteLike);

module.exports = router;