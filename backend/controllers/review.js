import reviewModel from "../models/review.js"
import { checkMissingFields } from "../validationUtils.js"

const addReview = async (req, res) => {
  const { userID } = req
  const { dishID, restaurantID, rating, comment } = req.body

  let missingFieldsResponse = checkMissingFields("review", req.body, [
    "rating",
    "comment",
  ])
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  try {
    const review = new reviewModel({
      userID,
      dishID,
      restaurantID,
      rating,
      comment,
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
  const { rating, comment } = req.body

  let missingFieldsResponse = checkMissingFields("review", req.body, [
    "rating",
    "comment",
  ])
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  try {
    const updatedReview = await reviewModel.findByIdAndUpdate(
      reviewID,
      { rating, comment },
      { new: true }
    )

    if (!updatedReview)
      return res.json({ success: false, message: "Review not found!" })

    res.json({ success: true, message: "Review updated!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in updating review: ${err}` })
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
    res.json({ success: false, message: `Error retrieving review: ${err}` })
  }
}

const getReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({}).sort({ createdAt: -1 })
    res.json({ success: true, data: reviews })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error retrieving review: ${err}` })
  }
}

const getRestaurantReviews = async (req, res) => {
  const { restaurantID } = req.params

  try {
    const reviews = await reviewModel.find({ restaurantID: restaurantID })
    res.status(200).json(reviews)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching restaurant reviews", error })
  }
}

const getDishReviews = async (req, res) => {
  const { dishID } = req.params

  try {
    const reviews = await reviewModel.find({ dishID: dishID })
    res.status(200).json(reviews)
  } catch (error) {
    res.status(500).json({ message: "Error fetching dish reviews", error })
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
}
