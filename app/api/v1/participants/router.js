const express = require('express')
const router = express()
const {
  authtenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth')

const { signup, activateParticipant, login } = require('./controller')

router.post('/auth/signup', signup)
router.put('/auth/activate', activateParticipant)
router.post('/auth/login', login)

module.exports = router
