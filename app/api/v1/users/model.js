const mongoose = require('mongoose')
const { model, Schema } = mongoose
const bcrypt = require('bcryptjs')

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama harus diisi'],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'email harus diisi'],
    },
    password: {
      type: String,
      required: [true, 'Password harus disi'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['admin', 'organizer', 'owner'],
    },
    organizer: {
      type: mongoose.Types.ObjectId,
      ref: 'Organizer',
      required: true,
    },
  },
  { timestamps: true }
)

// Sebelum di save ke database, field password dihash terlebih dahulu
userSchema.pre('save', async function (next) {
  const User = this
  if (User.isModified('password')) {
    User.password = await bcrypt.hash(User.password, 12)
  }

  next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = model('User', userSchema)
