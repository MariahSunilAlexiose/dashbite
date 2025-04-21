import dotenv from "dotenv"
import Stripe from "stripe"

import orderModel from "../models/order.js"
import userModel from "../models/user.js"

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173"
  try {
    const newOrder = new orderModel({
      userID: req.body.userID,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      deliveryType: req.body.deliveryType,
    })
    await newOrder.save()
    await userModel.findByIdAndUpdate(req.body.userID, { cartData: {} })
    const line_items = req.body.items.map((item) => ({
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
            req.body.deliveryType === "free_shipping"
              ? "Free Shipping"
              : req.body.deliveryType === "express_shipping"
                ? "Express Shipping"
                : "Pick Up",
        },
        unit_amount: req.body.deliveryType === "express_shipping" ? 1500 : 0,
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
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error!" })
  }
}

const verifyOrder = async (req, res) => {
  const { orderID, success } = req.body
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderID, { payment: true })
      res.json({ success: true, message: "Paid" })
    } else {
      await orderModel.findByIdAndDelete(orderID)
      res.json({ success: false, message: "Not Paid" })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" })
  }
}

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userID: req.body.userID })
      .sort({ date: -1 })
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error!" })
  }
}

const getOrderByID = async (req, res) => {
  try {
    const { orderID } = req.params
    const { userID } = req.body

    const order = await orderModel.findById(orderID)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (order.userID.toString() !== userID) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this order" })
    }

    res.json({ success: true, data: order })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

export { getOrderByID, userOrders, placeOrder, verifyOrder }
