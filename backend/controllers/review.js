import fs from "fs"

import dishModel from "../models/dish.js"
import restaurantModel from "../models/restaurant.js"
import reviewModel from "../models/review.js"
import { checkMissingFields } from "../validationUtils.js"

const addReview = async (req, res) => {
  const { userID } = req
  const { dishID, restaurantID, rating, comment, title } = req.body

  const filenames = req.files["images[]"]
    ? req.files["images[]"].map((file) => file.filename)
    : []

  let missingFieldsResponse = checkMissingFields("review", req.body, [
    "rating",
    "comment",
    "title",
  ])
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  if (filenames.length === 0) {
    missingFieldsResponse = missingFieldsResponse || {
      success: false,
      message: "Missing required field: images",
    }
  } else if (filenames.length > 10) {
    missingFieldsResponse = missingFieldsResponse || {
      success: false,
      message: "Exceeded the allowed limit of 10 images!",
    }
  }

  try {
    const review = new reviewModel({
      userID,
      dishID,
      restaurantID,
      rating,
      comment,
      title,
      images: filenames,
    })
    await review.save()
    res.json({ success: true, message: "Review added!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in adding review: ${err}` })
  }
}

const updateReview = async (req, res) => {
  const { reviewID } = req.params
  const { rating, comment, title, restaurantID, dishID } = req.body
  const filenames = req.files ? req.files.map((file) => file.filename) : []

  try {
    const review = await reviewModel.findById(reviewID)
    if (!review) {
      return res.json({ success: false, message: "Review not found!" })
    }

    const previousRestaurantID = review.restaurantID
    const previousDishID = review.dishID

    let updatedData = {
      rating: rating || review.rating,
      comment: comment || review.comment,
      title: title || review.title,
      restaurantID: restaurantID || review.restaurantID,
      dishID: dishID || review.dishID,
      images: filenames.length > 0 ? filenames : review.images,
    }

    if (filenames.length > 0) {
      review.images.forEach((image) => fs.unlink(`uploads/${image}`, () => {}))
    }

    const updatedReview = await reviewModel.findByIdAndUpdate(
      reviewID,
      updatedData,
      { new: true }
    )
    if (!updatedReview) {
      return res.json({ success: false, message: "Error in updating review!" })
    }

    // Unlink previous restaurant and dish IDs
    if (previousRestaurantID) {
      await restaurantModel.findByIdAndUpdate(previousRestaurantID, {
        $pull: { reviewIDs: reviewID },
      })
    }
    if (previousDishID) {
      await dishModel.findByIdAndUpdate(previousDishID, {
        $pull: { reviewIDs: reviewID },
      })
    }

    // Link new restaurant and dish IDs
    if (restaurantID) {
      await restaurantModel.findByIdAndUpdate(restaurantID, {
        $addToSet: { reviewIDs: reviewID },
      })
    }
    if (dishID) {
      await dishModel.findByIdAndUpdate(dishID, {
        $addToSet: { reviewIDs: reviewID },
      })
    }

    res.json({
      success: true,
      message: "Review updated successfully with new associations!",
    })
  } catch (err) {
    console.error("Error updating review:", err)
    res.json({
      success: false,
      message: `Error in updating review: ${err.message}`,
    })
  }
}

const deleteReview = async (req, res) => {
  const { reviewID } = req.params

  try {
    const deletedReview = await reviewModel.findByIdAndDelete(reviewID)
    if (!deletedReview)
      return res.json({ success: false, message: "Review not found!" })

    res.json({ success: true, message: "Review deleted!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in deleting review: ${err}` })
  }
}

const getReview = async (req, res) => {
  const { reviewID } = req.params

  try {
    const review = await reviewModel.findById(reviewID)
    if (!review)
      return res.json({ success: false, message: "Review not found!" })

    res.json({ success: true, data: review })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error fetching review: ${err}` })
  }
}

const getReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({}).sort({ createdAt: -1 })
    res.json({ success: true, data: reviews })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error fetching review: ${err}` })
  }
}

const getRestaurantReviews = async (req, res) => {
  const { restaurantID } = req.params
  try {
    const reviews = await reviewModel
      .find({ restaurantID: restaurantID })
      .sort({ updatedAt: -1 })
    res.json({ success: true, data: reviews })
  } catch (err) {
    console.error(err)
    res.json({
      success: false,
      message: `Error fetching restaurant reviews: ${err}`,
    })
  }
}

const getDishReviews = async (req, res) => {
  const { dishID } = req.params

  try {
    const reviews = await reviewModel.find({ dishID: dishID })
    res.json({ success: true, data: reviews })
  } catch (err) {
    console.error(err)
    res.json({
      success: false,
      message: `Error fetching dish reviews: ${err}`,
    })
  }
}

const getUserRestaurantReviews = async (req, res) => {
  const { userID } = req

  try {
    const reviews = await reviewModel
      .find({ userID, restaurantID: { $exists: true } })
      .sort({ updatedAt: -1 })
    res.json({ success: true, data: reviews })
  } catch (err) {
    console.error(err)
    res.json({
      success: false,
      message: `Error fetching restaurant reviews: ${err}`,
    })
  }
}

const getUserDishReviews = async (req, res) => {
  const { userID } = req

  try {
    const reviews = await reviewModel
      .find({ userID, dishID: { $exists: true } })
      .sort({ updatedAt: -1 })
    res.json({ success: true, data: reviews })
  } catch (err) {
    console.error(err)
    res.json({
      success: false,
      message: `Error fetching dish reviews: ${err}`,
    })
  }
}

export {
  addReview,
  updateReview,
  deleteReview,
  getReview,
  getReviews,
  getRestaurantReviews,
  getDishReviews,
  getUserDishReviews,
  getUserRestaurantReviews,
}
