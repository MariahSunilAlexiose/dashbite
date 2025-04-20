import express from "express"
import multer from "multer"

import {
  getUser,
  loginUser,
  registerUser,
  updateProfilePic,
  updateUser,
} from "../controllers/user.js"
import authMiddleware from "../middleware/auth.js"

const userRouter = express.Router()

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`)
  },
})

const upload = multer({ storage: storage })

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/:userID", authMiddleware, getUser)
userRouter.put("/update/:userID", authMiddleware, updateUser)
userRouter.put(
  "/update/:userID/profilePic",
  upload.single("profilePic"),
  authMiddleware,
  updateProfilePic
)

export default userRouter
