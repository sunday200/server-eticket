const mongoose = require('mongoose')
const { model, Schema } = mongoose

const ticketCategoriesSchema = Schema({
  type: {
    type: String,
    required: [true, 'Tipe ticket harus diisi'],
  },
  price: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  statusTicketCategories: {
    type: Boolean,
    enum: [true, false],
    default: true,
  },
  expired: {
    type: Date,
  },
})

const EventSchema = Schema(
  {
    title: {
      type: String,
      required: [true, 'Judul harus diisi'],
      minlength: 3,
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
      required: [true, 'Tag harus diisi'],
    },
    keyPoint: {
      type: [String],
    },
    venueName: {
      type: String,
      required: [true, 'tempat acara harus diisi'],
    },
    statusEvent: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
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
    tickets: {
      type: [ticketCategoriesSchema],
      required: true,
    },
    organizer: {
      type: mongoose.Types.ObjectId,
      ref: 'Organizer',
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = model('Event', EventSchema)
