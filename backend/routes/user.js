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
userRouter.put("/update/:userID", authMiddleware, updateUser)
userRouter.put(
  "/update/:userID/profilePic",
  upload.single("profilePic"),
  authMiddleware,
  updateProfilePic
)
userRouter.post("/add/:userID/address", authMiddleware, addAddresses)
userRouter.post("/update/:userID/address", authMiddleware, updateAddresses)

userRouter.get(
  "/:userID",
  (req, res, next) => {
    if (req.headers.token === process.env.ADMIN_TOKEN) {
      return adminAuthMiddleware(req, res, next)
    } else {
      return authMiddleware(req, res, next)
    }
  },
  (req, res) => {
    return getUser(req, res)
  }
)

// admin authenticated
userRouter.get("/", adminAuthMiddleware, getUsers)

export default userRouter
