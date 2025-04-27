import orderModel from "../models/order.js"
import userModel from "../models/user.js"

const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 })
    if (!orders) {
      res.json({ success: false, message: "Orders not found!" })
      return
    }
    res.json({ success: true, data: orders })
  } catch (err) {
    res.json({ success: false, message: `Error: ${err}` })
  }
}

const getOrder = async (req, res) => {
  const { orderID } = req.params
  if (!orderID)
    return res.json({ success: false, message: "Missing orderID field!" })

  try {
    const order = await orderModel.findOne({ _id: orderID })
    if (!order) {
      res.json({ success: false, message: "Order not found!" })
      return
    }
    res.json({ success: true, data: order })
  } catch (err) {
    res.json({ success: false, message: `Error! ${err}` })
  }
}

const deleteOrder = async (req, res) => {
  const { orderID } = req.params
  if (!orderID)
    return res.json({ success: false, message: "Missing orderID field!" })

  const order = await orderModel.findById(orderID)
  if (!order) {
    res.json({ success: false, message: "Order not found!" })
    return
  }

  try {
    const order = await orderModel.findByIdAndDelete(orderID)
    if (!order) {
      res.json({ success: false, message: "Error in deleting order!" })
      return
    }
    res.json({
      success: true,
      message: `Order with ID ${orderID} has been deleted successfully.`,
    })
  } catch (err) {
    res.json({ success: false, message: `Error deleting the order: ${err}` })
  }
}

const deleteOrderItem = async (req, res) => {
  try {
    const { orderID, itemID } = req.params
    if (!orderID || !itemID) {
      return res.json({
        error: "Missing required fields.",
        required: ["orderID", "itemID"],
      })
    }

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
      const order = await orderModel.findByIdAndDelete(orderID)
      if (!order) {
        res.json({ success: false, message: "Error in deleting order!" })
        return
      }
      res.json({
        success: true,
        message: `Order with ID ${orderID} has been deleted as it contained only one item.`,
      })
      return
    }

    order.items.splice(itemIndex, 1) // Removes the item from the order's items
    await order.save()

    res.json({
      success: true,
      message: `Item with ID ${itemID} removed from order ${orderID} successfully.`,
    })
  } catch (err) {
    res.json({ success: false, message: `Error deleting the item: ${err}` })
  }
}

const addOrder = async (req, res) => {
  const { userID, items, amount, deliveryType, status, payment, address } =
    req.body
  if (
    !userID ||
    !items ||
    !amount ||
    !deliveryType ||
    !status ||
    !payment ||
    !address
  ) {
    return res.json({
      error: "Missing required fields.",
      required: ["userID", "items", "amount", "deliveryType", "address"],
    })
  }

  const newOrder = new orderModel({
    userID: userID,
    items: items,
    amount: amount,
    address: address,
    status: status,
    date: new Date().toISOString(),
    payment: payment,
    deliveryType: deliveryType,
  })

  try {
    await newOrder.save()
    res.json({ success: true, message: "Order Created" })
  } catch (err) {
    res.json({ success: false, message: `Error in adding an order: ${err}` })
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({})
    if (!users) {
      res.json({ success: false, message: "Users not found!" })
      return
    }
    res.json({ success: true, data: users })
  } catch (err) {
    res.json({ success: false, message: `Error in retrieving users: ${err}` })
  }
}

const getUser = async (req, res) => {
  const { userID } = req.params
  if (!userID) {
    return res.json({ success: false, message: "Missing userID field!" })
  }

  try {
    const user = await userModel.findOne({ _id: userID })
    if (!user) {
      res.json({ success: false, message: "User not found!" })
      return
    }
    res.json({ success: true, data: user })
  } catch (err) {
    res.json({ success: false, message: `Error in retrieving user: ${err}` })
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
