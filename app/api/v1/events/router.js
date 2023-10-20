const express = require('express')
const router = express()

const {
  index,
  create,
  find,
  update,
  destroy,
  updateStatus,
} = require('./controller')

const {
  authtenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth')

router.get('/events', authtenticateUser, authorizeRoles('organizer'), index)

router.post('/events', authtenticateUser, authorizeRoles('organizer'), create)

router.get('/events/:id', authtenticateUser, authorizeRoles('organizer'), find)

router.put(
  '/events/:id',
  authtenticateUser,
  authorizeRoles('organizer'),
  update
)

router.delete(
  '/events/:id',
  authtenticateUser,
  authorizeRoles('organizer'),
  destroy
)

router.put(
  '/events/:id/status',
  authtenticateUser,
  authorizeRoles('organizer'),
  updateStatus
)

module.exports = router
