const express = require('express')
const router = express()

const {
  authtenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth')

const { index, find, create, update, destroy } = require('./controller')

router.get('/payments', authtenticateUser, authorizeRoles('organizer'), index)

router.get(
  '/payments/:id',
  authtenticateUser,
  authorizeRoles('organizer'),
  find
)

router.post('/payments', authtenticateUser, authorizeRoles('organizer'), create)

router.put(
  '/payments/:id',
  authtenticateUser,
  authorizeRoles('organizer'),
  update
)

router.delete(
  '/payments/:id',
  authtenticateUser,
  authorizeRoles('organizer'),
  destroy
)

module.exports = router
