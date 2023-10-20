const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require('./custom-api-error')

// 401 | ketika ada yang akses API tp gapunya token, nah pake error ini
class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message)

    this.StatusCode = StatusCodes.UNAUTHORIZED
  }
}

module.exports = UnauthorizedError
