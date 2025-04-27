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

export { getOrderByID, userOrders, placeOrder, verifyOrder }
