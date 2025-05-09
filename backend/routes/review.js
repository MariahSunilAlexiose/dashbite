import express from "express"

import {
  addReview,
  deleteReview,
  getDishReviews,
  getRestaurantReviews,
  getReview,
  getReviews,
  updateReview,
} from "../controllers/review.js"
import authMiddleware from "../middleware/auth.js"

const reviewRouter = express.Router()

reviewRouter.post("/", authMiddleware, addReview)
reviewRouter.put("/:reviewID", authMiddleware, updateReview)
reviewRouter.delete("/:reviewID", authMiddleware, deleteReview)
reviewRouter.get("/:reviewID", getReview)
reviewRouter.get("/", getReviews)
reviewRouter.get("/restaurant/:restaurantID", getRestaurantReviews)
reviewRouter.get("/dish/:dishID", getDishReviews)

export default reviewRouter
