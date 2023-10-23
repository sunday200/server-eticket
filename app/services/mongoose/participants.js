const Events = require('../../api/v1/events/model')
const Orders = require('../../api/v1/orders/model')
const Participants = require('../../api/v1/participants/model')
const Payments = require('../../api/v1/payments/model')

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

const getAllEvent = async () => {
  const result = await Events.find({ statusEvent: 'Published' })
    .populate('category')
    .populate('image')
    .select('_id title date tickets venueName')

  return result
}

const getOneEvent = async (req) => {
  const { id } = req.params

  const result = await Events.findOne({ _id: id })
    .populate('category')
    .populate({ path: 'talent', populate: 'image' })
    .populate('image')

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id: ${id}`)

  return result
}

const getAllOrders = async (req) => {
  // from jwt
  const participant = req.user.id

  const result = await Orders.find({ participant })

  return result
}

const checkoutOrder = async (req) => {
  const { event, personalDetail, payment, tickets } = req.body

  const checkingEvent = await Events.findOne({ _id: event })

  if (!checkingEvent)
    throw new NotFoundError(`Tidak ada acara dengan id: ${event}`)

  const checkingPayment = await Payments.findOne({ _id: payment })

  if (!checkingPayment)
    throw new NotFoundError(`Tidak ada payment dengan id: ${payment}`)

  let totalPay = 0,
    totalOrderTicket = 0

  await tickets.forEach((ticketBuy) => {
    // Chek di event
    checkingEvent.tickets.forEach((ticketAvail) => {
      // Chek apakah tipe tiket yang akan kita beli dengan tiket yang tersedia
      if (ticketBuy.ticketCategories.type === ticketAvail.type) {
        // Cek apakah jumlah tiket yang tersedia lebih banyak dari tiket yang akan dibeli
        if (ticketBuy.sumTicket > ticketAvail.stock) {
          throw new NotFoundError('stock tiket event tidak mencukupi')
        } else {
          // kurangi ticket yang tersedia dengan tiket yang dibeli
          ticketAvail.stock -= ticketBuy.sumTicket

          totalOrderTicket += ticketBuy.sumTicket

          totalPay += ticketBuy.ticketCategories.price * ticketBuy.sumTicket
        }
      }
    })
  })

  // Simpan di dalam database event | mengurangi jumlah tiket yang ada didatabase event
  await checkingEvent.save()

  const historyEvent = {
    title: checkingEvent.title,
    date: checkingEvent.date,
    about: checkingEvent.about,
    tagline: checkingEvent.tagline,
    keyPoint: checkingEvent.keyPoint,
    venueName: checkingEvent.venueName,
    tickets: tickets,
    image: checkingEvent.image,
    category: checkingEvent.category,
    talent: checkingEvent.talent,
    organizer: checkingEvent.organizer,
  }

  const result = new Orders({
    date: new Date(),
    personalDetail: personalDetail,
    totalPay,
    totalOrderTicket,
    orderItems: tickets,
    participant: req.user.id,
    event,
    historyEvent,
    payment,
  })

  await result.save()
  return result
}

module.exports = {
  signupParticipants,
  activateParticipants,
  signinParticipants,
  getAllEvent,
  getOneEvent,
  getAllOrders,
  checkoutOrder,
}
