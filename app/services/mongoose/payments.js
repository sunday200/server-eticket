const Payments = require('../../api/v1/payments/model')
const { checkingImages } = require('./images')

const { BadRequestError, NotFoundError } = require('../../errors')

const getAllPatments = async (req) => {
  let condition = { organizer: req.user.organizer }

  const result = await Payments.find(condition)
    .populate({
      path: 'image',
      select: '_id name',
    })
    .select('_id type status image')

  return result
}

const createPayments = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  const { type, image } = req.body

  await checkingImages(image)

  const check = await Payments.findOne({ type, organizer })

  if (check) throw new BadRequestError('Type pembayaran duplikat')

  const result = await Payments.create({
    image,
    type,
    organizer,
  })

  return result
}

const getOnePayments = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  const { id } = req.params

  const result = await Payments.findOne({ _id: id, organizer })
    .populate({
      path: 'image',
      select: '_id name',
    })
    .select('_id type status image')

  if (!result) throw new NotFoundError(`Tidak ada payment dengan id : ${id}`)

  return result
}

const updatePayments = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  const { id } = req.params
  const { type, image } = req.body

  await checkingImages(image)

  const check = await Payments.findOne({
    type,
    organizer,
    _id: { $ne: id },
  })

  if (check) throw new BadRequestError('Tipe pembayaran duplikat')

  const result = await Payments.findOneAndUpdate(
    { _id: id, organizer },
    { type, image },
    { new: true, runValidators: true }
  )

  if (!result)
    throw new BadRequestError(`Tidak ada pembayaran dengan id : ${id}`)

  return result
}

const deletePayments = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  const { id } = req.params

  const result = await Payments.findOne({
    _id: id,
    organizer,
  })

  if (!result) throw new NotFoundError(`Tidak ada payment dengan id: ${id}`)

  await result.deleteOne()

  return result
}

const checkingPayments = async (id) => {
  const result = await Payments.findOne({ _id: id })

  if (!result) throw new NotFoundError(`Tidak ada payment dengan id : ${id}`)

  return result
}

module.exports = {
  getAllPatments,
  getOnePayments,
  createPayments,
  deletePayments,
  updatePayments,
  checkingPayments,
}
