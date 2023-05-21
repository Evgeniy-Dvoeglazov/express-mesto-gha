const router = require("express").Router();
const {
  userIdValidation,
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

router.get("/:userId", getUser);

router.get("/me", getCurrentUser);

router.patch("/me", profileValidation, changeProfileInfo);

router.patch("/me/avatar", profileAvatar, changeAvatar);

module.exports = router;
