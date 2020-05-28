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
router.put('/changeAvatar', upload.single('img'), userController.changeAvatar);
// change cover
router.put('/changeCover', upload.single('img'), userController.changeCover);
// update info user
router.put('/', userController.updateUser);
// change password
router.put('/changePassword', userController.changePassword);
// delete user
router.put('/inactive', userController.inactiveUser);
// reactive user
router.put('/reactive', userController.reactiveUser);
// delete user forever
router.delete('/', userController.deleteUserForever);

module.exports = router
