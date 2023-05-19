const http2 = require("node:http2");

const { HTTP_STATUS_UNAUTHORIZED } = http2.constants; // 401

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
