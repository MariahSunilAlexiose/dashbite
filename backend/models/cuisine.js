import mongoose from "mongoose"

import { cuisineSchema } from "../schemas/cuisine.js"

const cuisineModel =
  mongoose.models.cuisine || mongoose.model("cuisine", cuisineSchema)

export default cuisineModel
