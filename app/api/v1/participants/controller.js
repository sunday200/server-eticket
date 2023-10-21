const {
  signupParticipants,
  activateParticipants,
  signinParticipants,
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

const activateParticipant = async (req, res, next) => {
  try {
    const result = await activateParticipants(req)

    res.status(StatusCodes.OK).json({
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await signinParticipants(req)

    res.status(StatusCodes.OK).json({
      data: { token: result },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { signup, activateParticipant, login }
