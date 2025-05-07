import express from "express"
import multer from "multer"

import {
  addCuisine,
  addCuisineDishes,
  deleteCuisine,
  deleteCuisineDishes,
  getCuisine,
  getCuisineDishes,
  getCuisines,
  updateCuisine,
} from "../controllers/cuisine.js"
import adminAuthMiddleware from "../middleware/adminauth.js"

const cuisineRouter = express.Router()

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`)
  },
})
const upload = multer({ storage: storage })

cuisineRouter.post("/", upload.single("image"), adminAuthMiddleware, addCuisine)
cuisineRouter.put(
  "/:cuisineID",
  upload.single("image"),
  adminAuthMiddleware,
  updateCuisine
)
cuisineRouter.delete("/:cuisineID", adminAuthMiddleware, deleteCuisine)
cuisineRouter.get("/:cuisineID", getCuisine)
cuisineRouter.get("/", getCuisines)
cuisineRouter.post("/:cuisineID/dishes", adminAuthMiddleware, addCuisineDishes)
cuisineRouter.get("/:cuisineID/dishes", getCuisineDishes)
cuisineRouter.delete(
  "/:cuisineID/dishes/:dishID",
  adminAuthMiddleware,
  deleteCuisineDishes
)

export default cuisineRouter
