const mongoose = require("mongoose");
const BadRequestError = require("../errors/bad-request-error");
const ConflictError = require("../errors/conflict-error");

const { Error } = mongoose;

module.exports = (err, req, res, next) => {
  if (err instanceof Error.ValidationError || err instanceof Error.CastError) {
    next(new BadRequestError("Переданы некорректные данные"));
  } else if (err.code === 11000) {
    next(new ConflictError("Пользователь с таким email уже существует"));
  } else {
    next(err);
  }
};
