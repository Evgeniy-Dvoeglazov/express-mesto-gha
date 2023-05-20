const router = require("express").Router();
const {
  createUserValidation,
  profileValidation,
  profileAvatar
} = require("../validation/userValidation");
const {
  getUsers,
  getUser,
  changeProfileInfo,
  changeAvatar,
  getCurrentUser
} = require("../controllers/users");

router.get("/", getUsers);

router.get("/:userId", createUserValidation, getUser);

router.get("/me", getCurrentUser);

router.patch("/me", profileValidation, changeProfileInfo);

router.patch("/me/avatar", profileAvatar, changeAvatar);

module.exports = router;
