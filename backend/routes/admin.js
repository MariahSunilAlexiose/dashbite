import express from "express"

import { getOrders } from "../controllers/admin.js"
import adminAuthMiddleware from "../middleware/adminauth.js"

const adminRouter = express.Router()

adminRouter.get("/orders", adminAuthMiddleware, getOrders)

export default adminRouter
