const Events = require('../../api/v1/events/model')
const { checkingImages } = require('./images')
const { checkingCategories } = require('./categories')
const { checkingTalents } = require('./talents')

const { NotFoundError, BadRequestError } = require('../../errors')

const getAllEvents = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  // from params
  const { keyword, category, talent, status } = req.query

  let condition = { organizer }

  if (keyword) {
    condition = { ...condition, title: { $regex: keyword, $options: 'i' } }
  }

  if (category) {
    condition = { ...condition, category: category }
  }

  if (talent) {
    condition = { ...condition, talent: talent }
  }

  if (['Published', 'Draft'].includes(status)) {
    condition = { ...condition, statusEvent: status }
  }

  const result = Events.find(condition)
    .populate({ path: 'image', select: '_id name' })
    .populate({
      path: 'category',
      select: '_id name',
    })
    .populate({
      path: 'talent',
      select: '_id name role image',
      populate: { path: 'image', select: '_id name' },
    })

  return result
}

const createEvents = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  // from body
  const {
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  } = req.body

  // Cari image, category, dam talent dengan field id
  await checkingImages(image)
  await checkingCategories(category)
  await checkingTalents(talent)

  // Cari event dengan field name
  const check = await Events.findOne({ title, organizer })

  // Apabila ada
  if (check) throw new BadRequestError('Judul acara sudah terdaftar')

  const result = await Events.create({
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
    organizer,
  })

  return result
}

const getOneEvent = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  // from params
  const { id } = req.params

  result = await Events.findOne({ _id: id, organizer })
    .populate({ path: 'image', select: '_id name' })
    .populate({
      path: 'category',
      select: '_id name',
    })
    .populate({
      path: 'talent',
      select: '_id name role image',
      populate: {
        path: 'image',
        select: '_id name',
      },
    })

  console.log(result)

  if (!result)
    throw new NotFoundError(`tidak ada kategori dengan id ini : ${id}`)

  return result
}

const updateEvents = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  // from body
  const { id } = req.params
  const {
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  } = req.body

  // Cari image, category, dan talent dengan id
  await checkingImages(image)
  await checkingCategories(category)
  await checkingTalents(talent)

  const result = await Events.findOneAndUpdate(
    { _id: id, organizer },
    {
      title,
      date,
      about,
      tagline,
      venueName,
      keyPoint,
      statusEvent,
      tickets,
      image,
      category,
      talent,
      organizer,
    },
    { new: true, runValidators: true }
  )

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id : ${id}`)

  // Cari event yang kemungkinan setelah diubah nama itu sama dengan nama yang sudah ada
  const check = await Events.findOne({ title, organizer, _id: { $ne: id } })

  if (check) throw new BadRequestError('Judul event duplikat')

  return result
}

const deleteEvents = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  // from params
  const { id } = req.params

  const result = await Events.findOne({ _id: id, organizer })

  if (!result) throw new NotFoundError(`Tidak ada event dengan id: ${id}`)

  await result.deleteOne()

  return result
}

const updateStatusEvent = async (req) => {
  // from jwt
  const organizer = req.user.organizer

  // from params
  const { id } = req.params

  // from body
  const { statusEvent } = req.body

  // check data from req.body | harus berisi draft atau publish
  if (!['Draft', 'Published'].includes(statusEvent)) {
    throw new BadRequestError('Masukan opsi update status yang benar')
  }

  result = await Events.findOneAndUpdate(
    { _id: id, organizer },
    { statusEvent },
    { new: true, runValidators: true }
  )

  if (!result) throw new NotFoundError(`Tidak ada event dengan id: ${id}`)

  return result
}

module.exports = {
  getAllEvents,
  createEvents,
  getOneEvent,
  updateEvents,
  deleteEvents,
  updateStatusEvent,
}
