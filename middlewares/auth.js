const token = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-error");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    throw new UnauthorizedError("Необходима авторизация");
  }
  let payload;

  try {
    payload = token.verify(jwt, NODE_ENV === "production" ? JWT_SECRET : "dev-secret");
  } catch (err) {
    const error = new UnauthorizedError("Необходима авторизация");

    next(error);
  }

  req.user = payload;

  next();
};
