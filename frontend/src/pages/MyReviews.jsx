import React, { useContext, useEffect, useState } from "react"

import { AccountCard, ReviewsTable } from "@cmp"
import { StoreContext } from "@context"
import { useToast } from "@providers"
import axios from "axios"

import { fetchEndpoint } from "@/constants"

const Reviews = () => {
  const { url, token } = useContext(StoreContext)
  const { addToast } = useToast()

  const [dishReviews, setDishReviews] = useState([])
  const [restaurantReviews, setRestaurantReviews] = useState([])
  const [formData, setFormData] = useState([])

  const [restaurantReviewModelOpen, setRestaurantReviewModelOpen] =
    useState(false)
  const [dishReviewModelOpen, setDishReviewModelOpen] = useState(false)

  const fetchReviews = async () => {
    // get dish reviews
    const dishReviewsData = await fetchEndpoint(url, "review/dish", { token })

    // Fetch details for each dish in the reviews
    const enrichedDishReviews = await Promise.all(
      dishReviewsData.map(async (dishReview) => {
        const dishDetails = await fetchEndpoint(
          url,
          `dish/${dishReview.dishID}`,
          { token }
        )
        return { ...dishReview, itemDetails: dishDetails }
      })
    )
    setDishReviews(enrichedDishReviews)

    // get restaurant reviews
    const restaurantReviewsData = await fetchEndpoint(
      url,
      "review/restaurant",
      {
        token,
      }
    )
    // Fetch details for each restaurant in the reviews
    const enrichedRestaurantReviews = await Promise.all(
      restaurantReviewsData.map(async (restaurantReview) => {
        const restaurantDetails = await fetchEndpoint(
          url,
          `restaurant/${restaurantReview.restaurantID}`,
          { token }
        )
        return { ...restaurantReview, itemDetails: restaurantDetails }
      })
    )
    setRestaurantReviews(enrichedRestaurantReviews)
  }

  const handleSave = async () => {
    try {
      await axios.put(`${url}/api/review/${formData._id}`, formData, {
        headers: { token },
      })
      window.location.reload()
      addToast("success", "Success", "Updated Review successfully!")
    } catch (err) {
      console.error("Error in updating addresses:", err)
      addToast("error", "Error", "Failed to update addresses!")
    }
  }

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${url}/api/review/${formData._id}`, {
        headers: { token },
      })
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }
      window.location.reload()
      addToast("success", "Success", "Deleted review successfully!")
    } catch (err) {
      console.error("Error deleting review:", err)
      addToast("error", "Error", "Failed to delete review!")
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [token])

  return (
    <div>
      <h2 className="text-center">My Account</h2>
      <div className="flex-center flex gap-10 py-10">
        <div className="w-1/6">
          <AccountCard />
        </div>
        <div className="flex flex-col">
          <ReviewsTable
            title="Restaurant Reviews"
            reviews={restaurantReviews}
            modalOpen={restaurantReviewModelOpen}
            setModalOpen={setRestaurantReviewModelOpen}
            formData={formData}
            setFormData={setFormData}
            handleSave={handleSave}
            handleDelete={handleDelete}
          />
          <ReviewsTable
            title="Dish Reviews"
            reviews={dishReviews}
            modalOpen={dishReviewModelOpen}
            setModalOpen={setDishReviewModelOpen}
            formData={formData}
            setFormData={setFormData}
            handleSave={handleSave}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  )
}

export default Reviews
