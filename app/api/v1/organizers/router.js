const express = require('express')
const router = express()
const {
  createCMSOrganizer,
  createCMSUser,
  getCMSUsers,
} = require('./controller')

const {
  authtenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth')

router.post(
  '/organizers',
  authtenticateUser,
  authorizeRoles('owner'),
  createCMSOrganizer
) //create organizer hanya oleh owner

router.post(
  '/users',
  authtenticateUser,
  authorizeRoles('organizer'),
  createCMSUser
) //create admin/user hanya oleh organizer

router.get('/users', authtenticateUser, authorizeRoles('owner'), getCMSUsers)

module.exports = router
