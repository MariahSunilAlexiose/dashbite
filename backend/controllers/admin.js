import orderModel from "../models/order.js"
import userModel from "../models/user.js"

const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 })
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error!" })
  }
}

const getOrder = async (req, res) => {
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
        res.json({
          success: false,
          message: "User not found for the given order.",
        })
      }
    } catch {
      res.json({ success: false, message: "Error fetching user data!" })
    }
  } catch {
    res.json({ success: false, message: "Error fetching order!" })
  }
}

const deleteOrder = async (req, res) => {
  try {
    const { orderID } = req.params
    const order = await orderModel.findById(orderID)

    if (!order) {
      res.json({ success: false, message: "Order not found!" })
      return
    }

    try {
      await orderModel.findByIdAndDelete(orderID)
      res.json({
        success: true,
        message: `Order with ID ${orderID} has been deleted successfully.`,
      })
    } catch {
      res.json({ success: false, message: "Error deleting the order!" })
    }
  } catch {
    res.json({ success: false, message: "Error finding the order!" })
  }
}

const deleteOrderItem = async (req, res) => {
  try {
    const { orderID, itemID } = req.params
    const order = await orderModel.findById(orderID)

    if (!order) {
      res.json({ success: false, message: "Order not found!" })
      return
    }

    // Check if the item exists in the order
    const itemIndex = order.items.findIndex(
      (item) => item._id.toString() === itemID
    )

    if (itemIndex === -1) {
      res.json({ success: false, message: "Item not found in the order!" })
      return
    }

    if (order.items.length === 1) {
      await orderModel.findByIdAndDelete(orderID)
      res.json({
        success: true,
        message: `Order with ID ${orderID} has been deleted as it contained only one item.`,
      })
      return
    }

    // Remove the item from the order's items
    order.items.splice(itemIndex, 1)
    await order.save()

    res.json({
      success: true,
      message: `Item with ID ${itemID} removed from order ${orderID} successfully.`,
    })
  } catch {
    res.json({ success: false, message: "Error deleting the item!" })
  }
}

const addOrder = async (req, res) => {
  const { userID, items, amount, deliveryType, address } = req.body
  if (!userID || !items || !amount || !deliveryType || !address) {
    return res.status(400).json({
      error: "Missing required fields.",
      required: ["userID", "items", "amount", "deliveryType", "address"],
    })
  }

  const newOrder = new orderModel({
    userID: req.body.userID,
    items: req.body.items,
    amount: req.body.amount,
    address: req.body.address,
    status: req.body.status,
    date: new Date().toISOString(),
    payment: req.body.payment,
    deliveryType: req.body.deliveryType,
  })

  try {
    await newOrder.save()
    res.json({ success: true, message: "Order Created" })
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while adding the order.",
      err,
    })
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({})
    res.json({ success: true, data: users })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error!" })
  }
}

const getUser = async (req, res) => {
  const { userID } = req.params
  try {
    const users = await userModel.findOne({ _id: userID })
    res.json({ success: true, data: users })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error!" })
  }
}

export {
  getUser,
  getUsers,
  addOrder,
  deleteOrderItem,
  deleteOrder,
  getOrder,
  getOrders,
}
