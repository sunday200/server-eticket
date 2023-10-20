const Categories = require('../../api/v1/categories/model')

const { NotFoundError, BadRequestError } = require('../../errors')

const getAllCategories = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  const result = await Categories.find({ organizer }) // organizer: organizer  disingkat menjadi => organizer

  return result
}

const createCategories = async (req) => {
  // from header/jwt
  const organizer = req.user.organizer

  // from body
  const { name } = req.body

  // Cek apakah ada dobel
  const check = await Categories.findOne({ name, organizer })

  if (check) throw new BadRequestError('kategori nama duplikat')

  const result = await Categories.create({
    name,
    organizer,
  })

  return result
}

const getOneCategories = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  // from params
  const { id } = req.params

  const result = await Categories.findOne({
    _id: id,
    organizer,
  })

  if (!result)
    throw new NotFoundError(`tidak ada kategori dengan id ini : ${id}`)

  return result
}

const updateCategories = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  // from params
  const { id } = req.params
  // from body
  const { name } = req.body

  const check = await Categories.findOne({ name, _id: { $ne: id } })

  if (check) throw new BadRequestError('kategori nama duplikat')

  const result = await Categories.findOneAndUpdate(
    { _id: id, organizer },
    { name },
    { new: true, runValidators: true }
  )

  console.log(result)
  // Jika id result false / null maka akan menampilkan error dibawah ini
  if (!result) throw new NotFoundError(`tidak ada kategori dengan id: ${id}`)

  return result
}

const deleteCategories = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  // from params
  const { id } = req.params

  const result = await Categories.findOne({
    _id: id,
    organizer,
  })

  if (!result) throw new NotFoundError(`Tidak ada kategori dengan id: ${id}`)

  await result.deleteOne()

  return result
}

const checkingCategories = async (id) => {
  const result = await Categories.findOne({ _id: id })

  if (!result) throw new NotFoundError(`Tidak ada kategori dengan id : ${id}`)

  return result
}

module.exports = {
  getAllCategories,
  createCategories,
  getOneCategories,
  updateCategories,
  deleteCategories,
  checkingCategories,
}
