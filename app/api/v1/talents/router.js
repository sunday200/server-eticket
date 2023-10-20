const express = require('express')
const router = express()
const { create, index, find, update, destroy } = require('./controller')

const {
  authtenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth')

router.get('/talents', authtenticateUser, authorizeRoles('organizer'), index)
router.get('/talents/:id', authtenticateUser, authorizeRoles('organizer'), find)
router.put(
  '/talents/:id',
  authtenticateUser,
  authorizeRoles('organizer'),
  update
)
router.delete(
  '/talents/:id',
  authtenticateUser,
  authorizeRoles('organizer'),
  destroy
)
router.post('/talents', authtenticateUser, authorizeRoles('organizer'), create)

module.exports = router
