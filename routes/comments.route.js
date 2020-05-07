var express = require('express');
var commentController = require('../controllers/comments.controller');
var router = express.Router();

// get list comments
router.get('/', commentController.findAll);

// create comment
router.post('/:postId', commentController.createComment);

// list comments by post
router.get('/:postId', commentController.getCommentByPost);

// update comment
router.put('/:id', commentController.updateComment);

// delete comment
router.delete('/:id', commentController.deleteComment);

module.exports = router;