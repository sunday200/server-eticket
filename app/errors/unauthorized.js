const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require('./custom-api-error')

// Login sesesin 403
class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message)

    this.StatusCode = StatusCodes.FORBIDDEN
  }
}

module.exports = UnauthorizedError
