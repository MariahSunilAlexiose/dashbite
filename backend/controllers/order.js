import dotenv from "dotenv"
import Stripe from "stripe"

import orderModel from "../models/order.js"
import userModel from "../models/user.js"

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req, res) => {
  const { userID, items, amount, address, deliveryType } = req.body
  if (!userID || !items || !amount || !deliveryType || !address) {
    return res.json({
      error: "Missing required fields.",
      required: ["userID", "items", "amount", "deliveryType", "address"],
    })
  }

  const frontend_url = "http://localhost:5173"
  try {
    const newOrder = new orderModel({
      userID: userID,
      items: items,
      amount: amount,
      address: address,
      deliveryType: deliveryType,
    })
    await newOrder.save()
    const line_items = items.map((item) => ({
      price_data: {
        currency: "CAD",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }))
    line_items.push({
      price_data: {
        currency: "CAD",
        product_data: {
          name:
            deliveryType === "free_shipping"
              ? "Free Shipping"
              : deliveryType === "express_shipping"
                ? "Express Shipping"
                : "Pick Up",
        },
        unit_amount: deliveryType === "express_shipping" ? 1500 : 0,
      },
      quantity: 1,
    })
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderID=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderID=${newOrder._id}`,
    })
    res.json({ success: true, session_url: session.url })
  } catch (err) {
    res.json({ success: false, message: `Error in placing order: ${err}` })
  }
}

const verifyOrder = async (req, res) => {
  const { orderID, success } = req.body
  if (!orderID || !success) {
    return res.json({
      error: "Missing required fields.",
      required: ["orderID", "success"],
    })
  }

  try {
    if (success == "true") {
      const neworder = await orderModel.findByIdAndUpdate(orderID, {
        payment: true,
      })
      if (!neworder) {
        res.json({ success: false, message: "Error in updating order!" })
        return
      }
      const order = await orderModel.findById(orderID)
      if (!order) {
        res.json({ success: false, message: "Order not found!" })
        return
      }
      await userModel.findByIdAndUpdate(order.userID, { cartData: {} })
      res.json({ success: true, message: "Paid" })
    } else {
      await orderModel.findByIdAndDelete(orderID)
      res.json({ success: false, message: "Not Paid" })
    }
  } catch (err) {
    res.json({ success: false, message: `Error in verifying order: ${err}` })
  }
}

const userOrders = async (req, res) => {
  const { userID } = req.body
  if (!userID) {
    return res.json({ success: false, message: "Missing orderID field!" })
  }
  try {
    const orders = await orderModel.find({ userID: userID }).sort({ date: -1 })
    if (!orders) {
      res.json({ success: false, message: "Orders not found!" })
      return
    }
    res.json({ success: true, data: orders })
  } catch (err) {
    res.json({
      success: false,
      message: `Error in retrieving user's orders: ${err}`,
    })
  }
}

const getOrderByID = async (req, res) => {
  try {
    const { orderID } = req.params
    const { userID } = req.body
    if (!userID || !orderID) {
      return res.json({
        error: "Missing required fields.",
        required: ["userID", "orderID"],
      })
    }

    const order = await orderModel.findById(orderID)
    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      })
    }

    if (order.userID.toString() !== userID) {
      return res.json({
        success: false,
        message: "Not authorized to access this order",
      })
    }

    res.json({ success: true, data: order })
  } catch (err) {
    res.json({ success: false, message: `Error in retrieving order: ${err}` })
  }
}

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
  if (!userID || !items || !amount || !deliveryType || !status || !address) {
    return res.json({
      error: "Missing required fields.",
      required: [
        "userID",
        "items",
        "amount",
        "deliveryType",
        "status",
        "address",
      ],
    })
  } else if (!payment) {
    return res.json({ success: false, message: "Payment not done!" })
  }

  const newOrder = new orderModel({
    userID: userID,
    items: items,
    amount: amount,
    address: address,
    status: status,
    payment: payment,
    deliveryType: deliveryType,
  })

  try {
    await newOrder.save()
    res.json({ success: true, message: "Order Created!" })
  } catch (err) {
    res.json({ success: false, message: `Error in adding an order: ${err}` })
  }
}

export {
  getOrderByID,
  userOrders,
  placeOrder,
  verifyOrder,
  addOrder,
  deleteOrderItem,
  deleteOrder,
  getOrder,
  getOrders,
}
