const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        '-' +
        Math.round(Math.random() * 9999) +
        '-' +
        file.originalname
    )
    // cb(null, Math.floor(Math.random() * 99999999) + '-' + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    // acc file
    cb(null, true)
  } else {
    // reject file
    cb(
      {
        message: 'Unsupported file format',
      },
      false
    )
  }
}

const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 300000,
  },
  fileFilter: fileFilter,
})

module.exports = uploadMiddleware
