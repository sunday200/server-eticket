const mongoose = require('mongoose')
const { model, Schema } = mongoose

const orderDetailSchema = Schema({
  ticketCategories: {
    type: {
      type: String,
      require: [true, 'Tipe tiket harus disi'],
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  sumTicket: {
    type: Number,
    required: true,
  },
})

const orderSchema = Schema(
  {
    date: {
      type: Date,
      required: true,
    },

    personalDetail: {
      // jadikan array suapaya bisa order banyak
      firstName: {
        type: String,
        required: [true, 'Please provide firstName'],
        minlenth: 3,
        maxlength: 50,
      },
      lastName: {
        type: String,
        required: [true, 'Please provide LastName'],
        minlenth: 3,
        maxlength: 50,
      },
      email: {
        type: String,
        required: [true, 'please provide email'],
      },
      role: {
        type: String,
        default: 'Designer',
      },
    },

    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    totalPay: {
      type: Number,
      required: true,
    },
    totalOrderTicket: {
      type: Number,
      required: true,
    },

    orderItems: [orderDetailSchema],

    participant: {
      type: mongoose.Types.ObjectId,
      ref: 'Participant',
      requried: true,
    },
    payment: {
      type: mongoose.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    event: {
      type: mongoose.Types.ObjectId,
      ref: 'Event',
      required: true,
    },

    historyEvent: {
      title: {
        type: String,
        required: [true, 'Judul harus disi'],
        minlenth: 3,
        maxlength: 50,
      },
      date: {
        type: Date,
        required: [true, 'Tanggal dan waktu harus diisi'],
      },
      about: {
        type: String,
      },
      tagline: {
        type: String,
        required: [true, 'Tagline harus disi'],
      },
      keyPoint: {
        type: [String],
      },
      venueName: {
        type: String,
        required: [true, 'Tempat acara harus disi'],
      },

      category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
      },
      image: {
        type: mongoose.Types.ObjectId,
        ref: 'Image',
      },
      talent: {
        type: mongoose.Types.ObjectId,
        ref: 'Talent',
      },
      organizer: {
        type: mongoose.Types.ObjectId,
        ref: 'Organizer',
        required: true,
      },
    },
  },
  { timestamps: true }
)

module.exports = model('Order', orderSchema)
