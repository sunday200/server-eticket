const Event = require('../../api/v1/events/model')
const Orders = require('../../api/v1/orders/model')
// Participant
// Payment

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../../errors')

const { createJWT, createTokenUser } = require('../../utils')

const { otpMail } = require('../mail')

const signupParticipants = async (req) => {
  const { firstName, lastName, email, password, role } = req.body

  // jika email dan status tidak aktif
  let result = await signupParticipants.findOne({
    email,
    status: 'tidak aktif',
  })

  if (result) {
  } else {
    result = await Participants.create({
      firstName,
      lastName,
      email,
      password,
      role,
      otp: Math.floor(Math.random() * 9999),
    })

    await otpMail(email, result)

    delete result._doc.password
    delete result._doc.otp

    return result
  }
}

module.exports = { signupParticipants }
