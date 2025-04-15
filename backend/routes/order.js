import express from "express"

import {
  getOrderByID,
  placeOrder,
  userOrders,
  verifyOrder,
} from "../controllers/order.js"
import authMiddleware from "../middleware/auth.js"

const orderRouter = express.Router()

orderRouter.post("/place", authMiddleware, placeOrder)
orderRouter.post("/verify", verifyOrder)
orderRouter.get("/myOrders", authMiddleware, userOrders)
orderRouter.get("/:orderID", authMiddleware, getOrderByID)

export default orderRouter
