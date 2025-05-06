import mongoose from "mongoose"

import { categorySchema } from "../schemas/category.js"

const categoryModel =
  mongoose.models.categories || mongoose.model("categories", categorySchema)

export default categoryModel
