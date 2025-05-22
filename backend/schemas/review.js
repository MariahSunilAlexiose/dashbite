import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    restaurantID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
      required: false,
    },
    dishID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
      required: false,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500,
    },
    title: {
      type: String,
      required: true,
    },
    images: [{ type: String }],
  },
  { timestamps: true, collection: "review" }
)

export { reviewSchema }
