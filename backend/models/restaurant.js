import mongoose from "mongoose"

import { restaurantSchema } from "../schemas/restaurant.js"

const restaurantModel =
  mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema)

export default restaurantModel
