import express from "express"

import { getOrderByID, getOrders } from "../controllers/admin.js"
import adminAuthMiddleware from "../middleware/adminauth.js"

const adminRouter = express.Router()

adminRouter.get("/orders", adminAuthMiddleware, getOrders)
adminRouter.get("/orders/:orderID", adminAuthMiddleware, getOrderByID)

export default adminRouter
