import express from "express"

import { deleteOrder, getOrder, getOrders } from "../controllers/admin.js"
import adminAuthMiddleware from "../middleware/adminauth.js"

const adminRouter = express.Router()

adminRouter.get("/orders", adminAuthMiddleware, getOrders)
adminRouter.get("/orders/:orderID", adminAuthMiddleware, getOrder)
adminRouter.delete("/orders/delete/:orderID", adminAuthMiddleware, deleteOrder)

export default adminRouter
