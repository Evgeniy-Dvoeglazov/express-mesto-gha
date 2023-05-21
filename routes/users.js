const router = require("express").Router();
const auth = require("../middlewares/auth");
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

router.get("/", auth, getUsers);

router.get("/:userId", auth, userIdValidation, getUser);

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, profileValidation, changeProfileInfo);

router.patch("/me/avatar", auth, profileAvatar, changeAvatar);

module.exports = router;
