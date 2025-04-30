import dotenv from "dotenv"
import Stripe from "stripe"

import orderModel from "../models/order.js"
import userModel from "../models/user.js"
import { checkMissingFields } from "../validationUtils.js"

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req, res) => {
  const { items, amount, address, deliveryType } = req.body
  let missingFieldsResponse = checkMissingFields("order", req.body, [
    "items",
    "amount",
    "deliveryType",
    "address",
  ])
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  const frontend_url = "http://localhost:5173"
  try {
    const newOrder = new orderModel({
      userID: req.userID,
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
  let missingFieldsResponse = checkMissingFields("order", req.body, [
    "orderID",
    "success",
  ])
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

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
  try {
    const orders = await orderModel
      .find({ userID: req.userID })
      .sort({ date: -1 })
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

    const order = await orderModel.findById(orderID)
    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      })
    }

    if (order.userID.toString() !== req.userID) {
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
  let missingFieldsResponse = checkMissingFields("order", req.body, [
    "items",
    "amount",
    "deliveryType",
    "status",
    "address",
  ])
  if (missingFieldsResponse) return res.json(missingFieldsResponse)
  if (!payment) {
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
