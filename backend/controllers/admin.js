import orderModel from "../models/order.js"
import userModel from "../models/user.js"

const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}) // Fetch all orders

    const transformedOrders = await Promise.all(
      orders.map(async (order) => {
        try {
          // Fetch the user's details using the userID from the userModel
          const user = await userModel.findById(order.userID)

          if (user) {
            // eslint-disable-next-line no-unused-vars
            const { userID, ...rest } = order._doc // Destructure to exclude unwanted fields
            return {
              ...rest,
              user: user,
            }
          } else {
            console.error(`User not found for userID: ${order.userID}`)
            return null // Handle orders with missing user data, if necessary
          }
        } catch (error) {
          console.error(
            `Error fetching user data for userID ${order.userID}:`,
            error
          )
          return null // Gracefully handle errors
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

export { getOrders }
