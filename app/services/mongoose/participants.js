const Event = require('../../api/v1/events/model')
const Orders = require('../../api/v1/orders/model')
const Participants = require('../../api/v1/participants/model')
// Payment

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../../errors')

const { createJWT, createTokenParticipant } = require('../../utils')

const { otpMail } = require('../mail')

const signupParticipants = async (req) => {
  const { firstName, lastName, email, password, role } = req.body

  // jika email dan status tidak aktif
  let result = await Participants.findOne({
    email,
    status: 'tidak aktif',
  })

  console.log(result)

  if (result) {
    result.firstName = firstName
    result.lastName = lastName
    result.email = email
    result.password = password
    result.role = role
    result.otp = Math.floor(Math.random() * 9999)
    await result.save()
  } else {
    result = await Participants.create({
      firstName,
      lastName,
      email,
      password,
      role,
      otp: Math.floor(Math.random() * 9999),
    })
  }
  await otpMail(email, result)

  delete result._doc.password
  delete result._doc.otp

  return result
}

const activateParticipants = async (req) => {
  const { email, otp } = req.body
  const check = await Participants.findOne({
    email,
  })

  if (!check) throw new NotFoundError('Partisipan belum terdaftar')

  if (check && check.otp !== otp) throw new BadRequestError('Kode otp salah')

  const result = await Participants.findOneAndUpdate(
    { _id: check._id },
    {
      status: 'aktif',
    },
    { new: true, runValidators: true }
  )

  delete result._doc.password

  return result
}

const signinParticipants = async (req) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const result = await Participants.findOne({ email })

  if (!result) {
    throw new UnauthorizedError('Invalid creadential')
  }

  if (result.status === 'tidak aktif') {
    throw new BadRequestError('Akun anda belum aktif')
  }

  const isPasswordCorrent = await result.comparePassword(password)

  if (!isPasswordCorrent) {
    throw new UnauthorizedError('Invalid creadential')
  }

  const token = createJWT({ payload: createTokenParticipant(result) })

  return token
}

module.exports = {
  signupParticipants,
  activateParticipants,
  signinParticipants,
}
