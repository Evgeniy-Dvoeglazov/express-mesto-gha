const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../errors/not-found-error");

router.post("/signin", login);
router.post("/signup", createUser);

router.use(auth);

router.use("/users", require("./users"));
router.use("/cards", require("./cards"));

router.all("*", () => {
  throw new NotFoundError("Карточка не найдена");
});

module.exports = router;
