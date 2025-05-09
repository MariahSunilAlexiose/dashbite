import mongoose from "mongoose"

import { reviewSchema } from "../schemas/review.js"

const reviewModel =
  mongoose.models.review || mongoose.model("review", reviewSchema)

export default reviewModel
