import mongoose from "mongoose"

import { dishSchema } from "../schemas/dish.js"

const dishModel = mongoose.models.dish || mongoose.model("dish", dishSchema)

export default dishModel
