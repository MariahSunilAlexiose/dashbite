import mongoose from "mongoose"

import { dishSchema } from "../schemas/food.js"

const dishModel = mongoose.models.dishes || mongoose.model("dishes", dishSchema)

export default dishModel
