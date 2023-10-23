const express = require('express')
const router = express()
const {
  authtenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth')

const {
  signup,
  activateParticipant,
  login,
  index,
  find,
  getOrder,
} = require('./controller')

router.post('/auth/signup', signup)
router.put('/auth/activate', activateParticipant)
router.post('/auth/login', login)
router.get('/events', index)
router.get('/events/:id', find)
router.get('/orders', authtenticateUser, getOrder)

module.exports = router
