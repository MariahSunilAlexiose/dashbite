import express from "express"
import multer from "multer"

import {
  addRestaurant,
  deleteRestaurant,
  getRestaurant,
  getRestaurants,
  removeRestaurantDish,
  updateRestaurant,
} from "../controllers/restaurant.js"
import adminAuthMiddleware from "../middleware/adminauth.js"

const restaurantRouter = express.Router()

// Image Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`)
  },
})

const upload = multer({ storage })

restaurantRouter.post(
  "/",
  adminAuthMiddleware,
  upload.fields([{ name: "images[]", maxCount: 10 }]),
  addRestaurant
)
restaurantRouter.put(
  "/:restaurantID",
  adminAuthMiddleware,
  upload.fields([{ name: "images[]", maxCount: 10 }]),
  updateRestaurant
)
restaurantRouter.delete("/:restaurantID", adminAuthMiddleware, deleteRestaurant)
restaurantRouter.get("/:restaurantID", getRestaurant)
restaurantRouter.get("/", getRestaurants)
restaurantRouter.delete(
  "/:restaurantID/dish/:dishID",
  adminAuthMiddleware,
  removeRestaurantDish
)

export default restaurantRouter
