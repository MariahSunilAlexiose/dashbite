import mongoose from "mongoose"

const cuisineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    dishIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "dish" }],
    restaurantIDs: [
      { type: mongoose.Schema.Types.ObjectId, ref: "restaurant" },
    ],
  },
  { timestamps: true, collection: "cuisine" }
)

export { cuisineSchema }
