const Users = require('../../api/v1/users/model')
const { BadRequestError, UnauthorizedError } = require('../../errors')
const { createTokenUser, createJWT } = require('../../utils')

const signin = async (req) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const result = await Users.findOne({ email })

  if (!result) {
    throw new UnauthorizedError('Invalid Credentials')
  }

  const isPasswordCorrent = await result.comparePassword(password)
  if (!isPasswordCorrent) {
    throw new UnauthorizedError('Invalid Credentials')
  }

  const token = createJWT({ payload: createTokenUser(result) })

  return token
}

module.exports = { signin }
