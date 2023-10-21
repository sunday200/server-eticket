const {
  signupParticipants,
} = require('../../../services/mongoose/participants')

const { StatusCodes } = require('http-status-codes')

const signup = async (req, res, next) => {
  try {
    const result = await signupParticipants(req)

    res.status(StatusCodes.CREATED).json({
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { signup }