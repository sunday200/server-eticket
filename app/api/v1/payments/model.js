const mongoose = require('mongoose')
const { model, Schema } = mongoose

const PaymentSchema = Schema(
  {
    type: {
      //nama jenis pembayaran
      type: String,
      required: [true, 'tipe pembayaran harus disi'],
      minlenth: 3,
      maxlength: 50,
    },
    status: {
      // kalo stataus true maka kit tampilin, kalo false tidak
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    image: {
      type: mongoose.Types.ObjectId,
      ref: 'Image',
      requried: true,
    },
    organizer: {
      type: mongoose.Types.ObjectId,
      ref: 'Organizer',
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = model('Payment', PaymentSchema)
