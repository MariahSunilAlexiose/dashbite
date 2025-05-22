import mongoose from "mongoose"

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipcode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    cuisineIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "cuisine" }],
    website: { type: String },
    openingHours: { type: String, required: true },
    rating: { type: Number, default: 0 },
    images: [{ type: String }],
    dishIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "dish" }],
    description: { type: String, required: true },
  },
  { timestamps: true, collection: "restaurant" }
)

export { restaurantSchema }
