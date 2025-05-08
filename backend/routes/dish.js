import express from "express"
import multer from "multer"

import {
  addDish,
  getDish,
  listDishes,
  removeDish,
  updateDish,
} from "../controllers/dish.js"
import adminAuthMiddleware from "../middleware/adminauth.js"

const dishRouter = express.Router()

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`)
  },
})

const upload = multer({ storage: storage })

dishRouter.get("/", listDishes)
dishRouter.get("/:dishID", getDish)

// admin authenticated
dishRouter.post("/", upload.single("image"), adminAuthMiddleware, addDish)
dishRouter.delete("/:dishID", adminAuthMiddleware, removeDish)
dishRouter.put(
  "/:dishID",
  upload.single("image"),
  adminAuthMiddleware,
  updateDish
)

export default dishRouter
