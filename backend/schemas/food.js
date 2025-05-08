import mongoose from "mongoose"

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    rating: { type: Number, required: true },
    cuisineIDs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cuisine",
        required: true,
      },
    ],
    restaurantID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
      required: true,
    },
  },
  { timestamps: true }
)

export { dishSchema }
