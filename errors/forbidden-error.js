const http2 = require("node:http2");

const { HTTP_STATUS_FORBIDDEN } = http2.constants; // 403

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_FORBIDDEN;
  }
}

module.exports = ForbiddenError;
