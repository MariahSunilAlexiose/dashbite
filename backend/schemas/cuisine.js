import mongoose from "mongoose"

const cuisineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    dishIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "dish" }],
    restaurantID: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant" },
  },
  { timestamps: true }
)

export { cuisineSchema }
