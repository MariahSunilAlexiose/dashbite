import mongoose from "mongoose"

const cuisineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    dishIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "dishes" }],
  },
  { timestamps: true }
)

export { cuisineSchema }
