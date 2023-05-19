const router = require("express").Router();
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

router.patch("/me", changeProfileInfo);

router.patch("/me/avatar", changeAvatar);

module.exports = router;
