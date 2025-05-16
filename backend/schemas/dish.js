import mongoose from "mongoose"

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
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
    servingSize: { type: String, default: "1" },
    ingredients: [{ type: String, required: true }],
    calories: { type: Number, required: true },
    fat: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    allergens: [{ type: String, required: true }],
  },
  { timestamps: true, collection: "dish" }
)

export { dishSchema }
