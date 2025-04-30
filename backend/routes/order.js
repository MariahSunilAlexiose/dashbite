import express from "express"

import {
  addOrder,
  deleteOrder,
  deleteOrderItem,
  getOrder,
  getOrderByID,
  getOrders,
  placeOrder,
  userOrders,
  verifyOrder,
} from "../controllers/order.js"
import adminAuthMiddleware from "../middleware/adminauth.js"
import authMiddleware from "../middleware/auth.js"

const orderRouter = express.Router()

orderRouter.post("/verify", verifyOrder)

// user authenticated
orderRouter.post("/place", authMiddleware, placeOrder)
orderRouter.get("/myorders", authMiddleware, userOrders)

orderRouter.get(
  "/:orderID",
  (req, res, next) => {
    if (req.headers.token === process.env.ADMIN_TOKEN)
      return adminAuthMiddleware(req, res, next)
    else return authMiddleware(req, res, next)
  },
  (req, res) => {
    if (req.headers.token === process.env.ADMIN_TOKEN) return getOrder(req, res)
    else return getOrderByID(req, res)
  }
)

// admin authenticated
orderRouter.get("/", adminAuthMiddleware, getOrders)
orderRouter.delete("/:orderID", adminAuthMiddleware, deleteOrder)
orderRouter.delete(
  "/:orderID/items/:itemID",
  adminAuthMiddleware,
  deleteOrderItem
)
orderRouter.post("/", adminAuthMiddleware, addOrder)

export default orderRouter
