import express from "express"
import multer from "multer"

import {
  addReview,
  deleteReview,
  getDishReviews,
  getRestaurantReviews,
  getReview,
  getReviews,
  getUserDishReviews,
  getUserRestaurantReviews,
  updateReview,
} from "../controllers/review.js"
import authMiddleware from "../middleware/auth.js"

const reviewRouter = express.Router()

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

reviewRouter.get("/dish", authMiddleware, getUserDishReviews)
reviewRouter.get("/restaurant", authMiddleware, getUserRestaurantReviews)
reviewRouter.put(
  "/:reviewID",
  authMiddleware,
  upload.fields([{ name: "images[]", maxCount: 10 }]),
  updateReview
)
reviewRouter.post("/", authMiddleware, addReview)
reviewRouter.delete("/:reviewID", authMiddleware, deleteReview)
reviewRouter.get("/:reviewID", getReview)
reviewRouter.get("/", getReviews)
reviewRouter.get("/restaurant/:restaurantID", getRestaurantReviews)
reviewRouter.get("/dish/:dishID", getDishReviews)

export default reviewRouter
