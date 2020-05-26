const userController = require('../controllers/users.controller');
const upload = require('../common/upload');
const router = require('express').Router()

// get list users
router.get('/', userController.findAll);
// get user by username
router.get('/:username', userController.findByUsername);
// update user
router.put('/', userController.updateUser);
// change avatar
router.post('/changeAvatar', upload.single('img'), userController.changeAvatar);
// delete user
router.put('/inactive', userController.inactiveUser);
// reactive user
router.put('/reactive', userController.reactiveUser);
// delete user forever
router.delete('/', userController.deleteUserForever);

module.exports = router
