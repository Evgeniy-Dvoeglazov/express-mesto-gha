const token = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-error");

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    throw new UnauthorizedError("Необходима авторизация");
  }
  let payload;

  try {
    payload = token.verify(jwt, "some-secret-key");
  } catch (err) {
    const error = new UnauthorizedError("Необходима авторизация");

    next(error);
  }

  req.user = payload;

  next();
};
