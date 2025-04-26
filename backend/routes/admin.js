import express from "express"

import {
  addOrder,
  deleteOrder,
  deleteOrderItem,
  getOrder,
  getOrders,
  getUser,
  getUsers,
} from "../controllers/admin.js"
import adminAuthMiddleware from "../middleware/adminauth.js"

const adminRouter = express.Router()

adminRouter.get("/orders", adminAuthMiddleware, getOrders)
adminRouter.get("/order/:orderID", adminAuthMiddleware, getOrder)
adminRouter.delete("/orders/delete/:orderID", adminAuthMiddleware, deleteOrder)
adminRouter.delete(
  "/orders/:orderID/items/:itemID",
  adminAuthMiddleware,
  deleteOrderItem
)
adminRouter.post("/order", adminAuthMiddleware, addOrder)
adminRouter.get("/users", adminAuthMiddleware, getUsers)
adminRouter.get("/user/:userID", adminAuthMiddleware, getUser)

export default adminRouter
