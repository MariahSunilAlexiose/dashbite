import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Dish Processing..." },
    payment: { type: Boolean, default: false },
    deliveryType: { type: String, required: true },
  },
  { timestamps: true, collection: "order" }
)

export { orderSchema }
