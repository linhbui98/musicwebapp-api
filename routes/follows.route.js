var express = require('express');
var followController = require('../controllers/follows.controller');
var router = express.Router();

// get list follows
router.get('/', followController.findAll);

// get list user follows
router.get('/following/:userId', followController.getUserFollows);

// get list follower of user
router.get('/follower/:userId', followController.getFollowerOfUser);

// suggest follow
router.get('/suggest', followController.suggestFollow);

// create follows
router.post('/', followController.createFollow);

// delete follows
router.delete('/:followerId', followController.deleteFollow);

module.exports = router;