import mongoose from "mongoose"

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    cuisineIDs: [
      { type: mongoose.Schema.Types.ObjectId, ref: "cuisine", required: true },
    ],
    website: { type: String },
    openingHours: { type: String, required: true },
    rating: { type: Number, default: 0 },
    image: { type: String },
  },
  { timestamps: true }
)

export { restaurantSchema }
