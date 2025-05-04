import express from "express"

import {
  addOrder,
  deleteOrder,
  getOrder,
  getOrderByID,
  getOrders,
  placeOrder,
  updateOrder,
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
orderRouter.put("/:orderID", adminAuthMiddleware, updateOrder)
orderRouter.post("/", adminAuthMiddleware, addOrder)
orderRouter.get("/user/:userID", adminAuthMiddleware, userOrders)

export default orderRouter
