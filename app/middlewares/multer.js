const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, 'public/uploads/avatar')
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

const uploadMiddleware = multer({
  storage,
})

module.exports = uploadMiddleware
