const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-error");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { token } = req.cookies; // достаём токен из кук
  if (!token) {
    throw new UnauthorizedError("Необходима авторизация");
  }
  let payload;

  try {
    // Верифицируем токен
    payload = jwt.verify(token, NODE_ENV === "production" ? JWT_SECRET : "dev-secret");
  } catch (err) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
