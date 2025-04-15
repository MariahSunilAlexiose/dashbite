import mongoose from "mongoose"

import { orderSchema } from "../schemas/order.js"

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)

export default orderModel
