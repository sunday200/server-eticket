const {
  createOrganizer,
  createUsers,
  getAllUsers,
} = require('../../../services/mongoose/users')

const { StatusCodes } = require('http-status-codes')

const createCMSOrganizer = async (req, res, next) => {
  try {
    const result = await createOrganizer(req)

    res.status(StatusCodes.CREATED).json({
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const createCMSUser = async (req, res, next) => {
  try {
    const result = await createUsers(req)

    res.status(StatusCodes.CREATED).json({
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const getCMSUsers = async (req, res, next) => {
  try {
    const result = await getAllUsers(req)

    res.status(StatusCodes.OK).json({
      data: result,
    })
  } catch (error) {
    next(next)
  }
}

module.exports = {
  createCMSOrganizer,
  createCMSUser,
  getCMSUsers,
}
