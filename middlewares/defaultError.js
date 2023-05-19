const http2 = require("node:http2");

const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = http2.constants; // 500

module.exports = (err, req, res, next) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode)
    .send({
      message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR
        ? "На сервере произошла ошибка"
        : message
    });
  next();
};
