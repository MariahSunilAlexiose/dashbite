import express from "express"
import multer from "multer"

import {
  addCuisine,
  deleteCuisine,
  getCuisine,
  getCuisineDishes,
  getCuisineRestaurants,
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
cuisineRouter.get("/:cuisineID/dishes", getCuisineDishes)
cuisineRouter.get("/:cuisineID/restaurants", getCuisineRestaurants)

export default cuisineRouter
