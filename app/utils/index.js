const { createJWT } = require('./jwt')
const { createTokenUser } = require('./createTokenUser')

module.exports = {
  createTokenUser,
  createJWT,
}