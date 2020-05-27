var express = require('express');
var notificationController = require('../controllers/notifications.controller');
var router = express.Router();

// get list notification for user
router.get('/', notificationController.findAllForUser);

// create notification
router.post('/', notificationController.createNotification);

module.exports = router;