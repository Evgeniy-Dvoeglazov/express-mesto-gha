const mongoose = require("mongoose");
const BadRequestError = require("../errors/bad-request-error");

const { Error } = mongoose;

module.exports = (err, req, res, next) => {
  if (err instanceof Error.ValidationError || err instanceof Error.CastError) {
    next(new BadRequestError("Переданы некорректные данные"));
  } else {
    next(err);
  }
};
