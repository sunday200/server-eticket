const mongoose = require('mongoose')
const { model, Schema } = require('mongoose')
const bycript = require('bcryptjs')

const participantSchema = Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Nama depan harus diisi'],
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'email harus diisi'],
    },
    password: {
      type: String,
      required: [true, 'password harus disi'],
      minlength: 6,
    },
    role: {
      type: String,
      default: '-',
    },
    status: {
      type: String,
      enum: ['aktif', 'tidak aktif'],
      default: 'tidak aktif',
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

participantSchema.pre('save', async function (next) {
  const User = this
  if (User.isModified('password')) {
    User.password = await bycript.hash(User.password, 12)
  }
  next()
})

participantSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bycript.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = model('Participant', participantSchema)
