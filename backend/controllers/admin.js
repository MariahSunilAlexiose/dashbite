import orderModel from "../models/order.js"
import userModel from "../models/user.js"

const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 })

    const transformedOrders = await Promise.all(
      orders.map(async (order) => {
        try {
          const user = await userModel.findById(order.userID)

          if (user) {
            const { userID, ...rest } = order._doc // eslint-disable-line no-unused-vars
            return {
              ...rest,
              user: user,
            }
          } else {
            return null
          }
        } catch (error) {
          console.error(
            `Error fetching user data for userID ${order.userID}:`,
            error
          )
          return null
        }
      })
    )

    const filteredOrders = transformedOrders.filter((order) => order !== null)

    res.json({ success: true, data: filteredOrders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error!" })
  }
}

const getOrderByID = async (req, res) => {
  try {
    const { orderID } = req.params
    const order = await orderModel.findById(orderID)

    if (!order) {
      res.json({ success: false, message: "Order not found!" })
      return
    }

    try {
      const user = await userModel.findById(order.userID)

      if (user) {
        const { userID, ...rest } = order._doc // eslint-disable-line no-unused-vars
        res.json({
          success: true,
          data: {
            ...rest,
            user: user,
          },
        })
      } else {
        console.error(`User not found for userID: ${order.userID}`)
        res.json({
          success: false,
          message: "User not found for the given order.",
        })
      }
    } catch (error) {
      console.error(
        `Error fetching user data for userID ${order.userID}:`,
        error
      )
      res.json({ success: false, message: "Error fetching user data!" })
    }
  } catch (error) {
    console.error(`Error fetching order with ID ${req.params.id}:`, error)
    res.json({ success: false, message: "Error fetching order!" })
  }
}

export { getOrderByID, getOrders }
