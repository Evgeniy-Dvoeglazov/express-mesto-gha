const router = require('express').Router();
const { getUsers, getUser, createUser, changeProfileInfo, changeAvatar } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUser);

router.post('/', createUser);

router.patch('/me', changeProfileInfo);

router.patch('/me/avatar', changeAvatar);

module.exports = router;