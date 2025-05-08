import mongoose from "mongoose"

import { categorySchema } from "../schemas/category.js"

const categoryModel =
  mongoose.models.category || mongoose.model("category", categorySchema)

export default categoryModel
