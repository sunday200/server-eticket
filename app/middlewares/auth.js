const { UnauthorizedError, UnauthenticatedError } = require('../errors')
const { isTokenValid } = require('../utils/jwt')

const authtenticateUser = async (req, res, next) => {
  try {
    let token

    // Check header
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1]
    }

    if (!token) {
      throw new UnauthenticatedError('Authentication invalid')
    }

    const payload = isTokenValid({ token })

    // Attach the user and his permission to the req object
    req.user = {
      email: payload.email,
      role: payload.role,
      name: payload.name || payload.firstName,
      organizer: payload.organizer,
      id: payload.userId || payload.participanId,
    }

    /*
    ini dari participan
    firstName: participan.firstName,
    lastName: participan.lastName,
    email: participan.email,
    participanId: participan._id,
    */

    next()
  } catch (error) {
    next(error)
  }
}
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unatorized to access this route')
    }

    next()
  }
}

module.exports = { authtenticateUser, authorizeRoles }
