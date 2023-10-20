const express = require('express')
const router = express()
const { index } = require('./controller')
const {
  authorizeRoles,
  authtenticateUser,
} = require('../../../middlewares/auth')

router.get(
  '/orders',
  authtenticateUser,
  authorizeRoles('admin', 'organizer', 'owner'),
  index
)

module.exports = router
