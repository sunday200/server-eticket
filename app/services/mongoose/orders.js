const Orders = require('../../api/v1/orders/model')
// API ORDER PART 5
const getAllOrders = async (req) => {
  const { limit = 10, page = 1, startDate, endDate } = req.query

  let condition = {}

  if (req.user.role !== 'owner') {
    condition = {
      ...condition,
      'historyEvent.organizer': req.user.organizer,
    }
    // match = { organizer: req.user.organizer } // req.user.organizer berasal dari jwt
  }

  if (startDate && endDate) {
    const start = new Date(startDate)
    start.setHours(0, 0, 0)
    const end = new Date(endDate)
    end.setHours(0, 0, 0)

    condition = {
      ...condition,
      date: {
        $gte: start, //$gte adalah greater than or equeal
        $lt: end, // $lt adalah less than
      },
    }
  }

  const result = await Orders.find(condition)
    .limit(limit)
    .skip(limit * (page - 1)) // jika page = 0 => skip(1=0) ,,, jika page = 1 => skip(10)

  const count = await Orders.countDocuments(condition) //countDocument menghitung total dari ordernya / isi data didalamnya

  return { data: result, pages: Math.ceil(count / limit), total: count }
}

module.exports = {
  getAllOrders,
}
