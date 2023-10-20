// import model Talents
const Talents = require('../../api/v1/talents/model')
const { checkingImages } = require('./images')

// import custom error not found dan bad request
const { NotFoundError, BadRequestError } = require('../../errors')

const getAllTalents = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  const { keyword } = req.query

  let condition = { organizer }

  if (keyword) {
    condition = { ...condition, name: { $regex: keyword, $options: 'i' } }
  }

  const result = await Talents.find(condition)
    .populate({
      path: 'image',
      select: '_id name',
    })
    .select('_id name role image')

  return result
}

const createTalents = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  const { name, role, image } = req.body

  // cari image dengan field image
  await checkingImages(image)

  // cari talents dengan field name
  const check = await Talents.findOne({ name, organizer })

  // apa bila check true / data talents sudah ada maka kita tampilkan error bad request dengan message pembicara duplikat
  if (check) throw new BadRequestError('pembicara nama duplikat')

  const result = await Talents.create({ name, image, role, organizer })

  return result
}

const getOneTalents = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  const { id } = req.params

  const result = await Talents.findOne({ _id: id, organizer })
    .populate({
      path: 'image',
      select: '_id name',
    })
    .select('_id name role image')

  console.log(result)

  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`)

  return result
}

const updateTalents = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  const { id } = req.params
  const { name, image, role } = req.body

  // cari image dengan field image
  await checkingImages(image)

  // cari talents dengan field name dan id selain dari yang dikirim dari params
  const check = await Talents.findOne({
    name,
    organizer,
    _id: { $ne: id },
  })

  // apa bila check true / data talents sudah ada maka kita tampilkan error bad request dengan message pembicara nama duplikat
  if (check) throw new BadRequestError('pembicara nama sudah ada')

  const result = await Talents.findOneAndUpdate(
    { _id: id, organizer },
    { name, image, role },
    { new: true, runValidators: true }
  )

  // jika id result false / null maka akan menampilkan error `Tidak ada pembicara dengan id` yang dikirim client
  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`)

  return result
}

const deleteTalents = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  const { id } = req.params

  const result = await Talents.findOne({
    _id: id,
    organizer,
  })

  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`)

  await result.deleteOne()

  return result
}

const checkingTalents = async (id) => {
  const result = await Talents.findOne({ _id: id })

  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`)

  return result
}

module.exports = {
  getAllTalents,
  createTalents,
  getOneTalents,
  updateTalents,
  deleteTalents,
  checkingTalents,
}
