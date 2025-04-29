import express from "express"
import multer from "multer"

import {
  addAddresses,
  getUser,
  getUsers,
  loginUser,
  registerUser,
  updateAddresses,
  updateProfilePic,
  updateUser,
} from "../controllers/user.js"
import adminAuthMiddleware from "../middleware/adminauth.js"
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

// user authenticated
userRouter.put("/", authMiddleware, updateUser)
userRouter.put(
  "/profilePic",
  upload.single("profilePic"),
  authMiddleware,
  updateProfilePic
)
userRouter.post("/address", authMiddleware, addAddresses)
userRouter.put("/address", authMiddleware, updateAddresses)
userRouter.get("/", authMiddleware, getUser)

// admin authenticated
userRouter.get("/all", adminAuthMiddleware, getUsers)
userRouter.get("/:userID", adminAuthMiddleware, getUser)

export default userRouter
