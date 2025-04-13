import mongoose from "mongoose"

import { userSchema } from "../schemas/user.js"

const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel
