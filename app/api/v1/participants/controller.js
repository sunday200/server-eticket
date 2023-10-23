const {
  signupParticipants,
  activateParticipants,
  signinParticipants,
  getAllEvent,
  getOneEvent,
  getAllOrders,
  checkoutOrder,
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

const index = async (req, res, next) => {
  const result = await getAllEvent()

  res.status(StatusCodes.OK).json({
    data: result,
  })
}

const find = async (req, res, next) => {
  try {
    const result = await getOneEvent(req)

    res.status(StatusCodes.OK).json({
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const getOrder = async (req, res, next) => {
  try {
    const result = await getAllOrders(req)

    res.status(StatusCodes.OK).json({
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const checkout = async (req, res, next) => {
  try {
    const result = await checkoutOrder(req)

    res.status(StatusCodes.CREATED).json({
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  signup,
  activateParticipant,
  login,
  index,
  find,
  getOrder,
  checkout,
}
