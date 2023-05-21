const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-error");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthorizedError("Необходима авторизация");
  }
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === "production" ? JWT_SECRET : "dev-secret");
  } catch (err) {
    const error = new UnauthorizedError("Необходима авторизация");

    next(error);
  }

  req.user = payload;

  next();
};
