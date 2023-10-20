const Users = require('../../api/v1/users/model')
const Organizers = require('../../api/v1/organizers/model')
const { BadRequestError } = require('../../errors')

const { StatusCodes } = require('http-status-codes')

const createOrganizer = async (req) => {
  const { organizer, name, email, password, confirmPassword, role } = req.body

  if (password !== confirmPassword) {
    throw new BadRequestError('Password dan confirmPassword tidak cocok')
  }

  const result = await Organizers.create({ organizer })

  const users = await Users.create({
    email,
    name,
    password,
    role,
    organizer: result._id,
  })
  console.log(result)

  // blm solve
  // ketika user tidak ada maka delete field result
  // if (!users) {
  //   await result.deleteOne()
  // }

  delete users._doc.password

  return users
}

const createUsers = async (req, res) => {
  // from jwt
  const organizer = req.user.organizer

  // from body
  const { name, email, password, confirmPassword, role } = req.body

  if (password !== confirmPassword) {
    throw new BadRequestError('Password dan confirmPassword tidak cocok')
  }

  const result = await Users.create({
    name,
    email,
    organizer, //organizer: req.user.organizer
    password,
    role,
  })

  return result
}
// Buat liat semuanya, meliputi owner, organizer, admin
const getAllUsers = async (req) => {
  const result = await Users.find()

  return result
}

module.exports = { createOrganizer, createUsers, getAllUsers }
