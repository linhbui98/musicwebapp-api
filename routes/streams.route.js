const streamController = require('../controllers/streams.controller');
const router = require('express').Router()

// get record stream
router.get('/:userId', streamController.getStreams);

// save record stream
router.post('/', streamController.record);

module.exports = router
