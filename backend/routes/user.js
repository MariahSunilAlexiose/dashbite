import express from "express"

import { getUser, loginUser, registerUser } from "../controllers/user.js"
import authMiddleware from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/:userID", authMiddleware, getUser)

export default userRouter
