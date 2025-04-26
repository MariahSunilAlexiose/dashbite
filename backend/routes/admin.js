import express from "express"

import {
  addOrder,
  deleteOrder,
  deleteOrderItem,
  getOrder,
  getOrders,
  getUsers,
} from "../controllers/admin.js"
import adminAuthMiddleware from "../middleware/adminauth.js"

const adminRouter = express.Router()

adminRouter.get("/orders", adminAuthMiddleware, getOrders)
adminRouter.get("/orders/:orderID", adminAuthMiddleware, getOrder)
adminRouter.delete("/orders/delete/:orderID", adminAuthMiddleware, deleteOrder)
adminRouter.delete(
  "/orders/:orderID/items/:itemID",
  adminAuthMiddleware,
  deleteOrderItem
)
adminRouter.post("/order", adminAuthMiddleware, addOrder)
adminRouter.get("/users", adminAuthMiddleware, getUsers)

export default adminRouter
