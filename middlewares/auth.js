const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/not-found-error");

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }
  let payload;

  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    const error = new UnauthorizedError("Необходима авторизация");

    next(error);
  }

  req.user = payload;

  next();
};
