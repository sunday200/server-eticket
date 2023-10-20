const express = require('express')
const router = express()
const { create, index, find, update, destroy } = require('./controller')
const {
  authtenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth')

router.get('/categories', authtenticateUser, authorizeRoles('organizer'), index)

router.get(
  '/categories/:id',
  authtenticateUser,
  authorizeRoles('organizer'),
  find
)
router.put(
  '/categories/:id',
  authtenticateUser,
  authorizeRoles('organizer'),
  update
)
router.delete(
  '/categories/:id',
  authtenticateUser,
  authorizeRoles('organizer'),
  destroy
)

router.post(
  '/categories',
  authtenticateUser,
  authorizeRoles('organizer'),
  create
)
module.exports = router
