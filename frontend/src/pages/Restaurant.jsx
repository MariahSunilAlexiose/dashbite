import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { ProgressBar, RestaurantTabs, Separator } from "@cmp"
import { dark, StoreContext } from "@context"
import {
  ChevronRightIcon,
  ChevronRightWhiteIcon,
  DarkMapPinIcon,
  MapPinIcon,
  StarIcon,
} from "@icons"
import { useTheme, useToast } from "@providers"

import { fetchEndpoint, getRatingImage } from "@/constants"

const Restaurant = () => {
  const { restaurantID } = useParams()
  const { theme } = useTheme()
  const { url } = useContext(StoreContext)
  const { addToast } = useToast()
  const [restaurant, setRestaurant] = useState({})
  const [reviewsByStars, setReviewsByStars] = useState({
    5: [],
    4: [],
    3: [],
    2: [],
    1: [],
  })

  const fetchDish = async () => {
    try {
      // get restaurant
      const restaurantData = await fetchEndpoint(
        url,
        `restaurant/${restaurantID}`
      )

      // get restaurant reviews
      const restaurantReviewsData = await fetchEndpoint(
        url,
        `review/restaurant/${restaurantID}`
      )

      // reviews by rating
      setReviewsByStars(() => {
        const updatedReviews = { 5: [], 4: [], 3: [], 2: [], 1: [] }

        restaurantReviewsData.forEach((review) => {
          updatedReviews[review.rating] = [
            ...updatedReviews[review.rating],
            review,
          ]
        })

        return updatedReviews
      })

      // get user for each review
      const reviewsWithUserData = await Promise.all(
        restaurantReviewsData.map(async (review) => {
          const userData = await fetchEndpoint(url, `user/${review.userID}`)
          return { ...review, user: userData }
        })
      )

      setRestaurant({ ...restaurantData, reviews: reviewsWithUserData })
    } catch (err) {
      console.error("Error fetching dish:", err)
      addToast("error", "Error", "Failed to fetch dish!")
    }
  }

  useEffect(() => {
    fetchDish()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="mt-3 flex cursor-pointer items-center">
        <p>{restaurant.address?.country}</p>
        <img
          src={theme === dark ? ChevronRightWhiteIcon : ChevronRightIcon}
          alt="Chevron Right Icon"
          className="h-4 w-4"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="p-0">{restaurant.name}</h2>

        <div className="flex h-5 gap-2">
          {/* rating + reviews count */}
          <div className="flex items-center gap-1">
            <img src={StarIcon} alt="Star Icon" className="h-4 w-4" />
            <p className="m-0">{restaurant.rating}</p>
            {restaurant.reviews?.length > 0 && (
              <div className="flex items-center gap-0.5">
                <span>(</span>
                <p className="m-0 px-0.5">{restaurant.reviews?.length || 0}</p>
                <span>reviews)</span>
              </div>
            )}
          </div>
          <Separator orientation="vertical" />

          {/* location */}
          <div className="flex items-center gap-1">
            <img
              src={theme === dark ? DarkMapPinIcon : MapPinIcon}
              alt="Map Pin Icon"
              className="h-4 w-4"
            />
            <p className="m-0">{restaurant.address?.city}</p>
          </div>
        </div>
      </div>
      {/* images */}
      <div className="flex gap-2">
        {restaurant.images &&
          restaurant.images
            .slice(0, 3)
            .map((image, index) => (
              <img
                key={image}
                src={`${url}/images/${image}`}
                alt={restaurant.name}
                className={`h-80 ${index == 0 ? "w-2/4" : "w-1/4"} rounded-2xl object-cover`}
              />
            ))}
      </div>
      <div className="flex gap-10">
        <div className="w-3/4">
          <RestaurantTabs restaurant={restaurant} />
        </div>
        <div className="flex w-1/4 flex-col gap-3">
          <h4>Customer Reviews</h4>
          {restaurant.reviews?.length > 0 ? (
            <div>
              {" "}
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <h2>{restaurant.reviews?.length}</h2>/ 5
                </div>
                <img
                  src={getRatingImage(restaurant.reviews?.length)}
                  alt="Rating Icon"
                  className="h-4 w-20"
                />
                Based on {restaurant.reviews?.length || 0} reviews
              </div>
              <Separator orientation="horizontal" />
              <div>
                <div className="flex items-center gap-2">
                  5 <img src={StarIcon} alt="Star Icon" className="h-4 w-4" />{" "}
                  <ProgressBar
                    value={(reviewsByStars[5].length / 5) * 100}
                    className="mt-2 w-[60%]"
                  />
                  {reviewsByStars[5].length}
                </div>
                <div className="flex items-center gap-2">
                  4 <img src={StarIcon} alt="Star Icon" className="h-4 w-4" />{" "}
                  <ProgressBar
                    value={(reviewsByStars[4].length / 5) * 100}
                    className="mt-2 w-[60%]"
                  />
                  {reviewsByStars[4].length}
                </div>
                <div className="flex items-center gap-2">
                  3 <img src={StarIcon} alt="Star Icon" className="h-4 w-4" />{" "}
                  <ProgressBar
                    value={(reviewsByStars[3].length / 5) * 100}
                    className="mt-2 w-[60%]"
                  />
                  {reviewsByStars[3].length}
                </div>
                <div className="flex items-center gap-2">
                  2 <img src={StarIcon} alt="Star Icon" className="h-4 w-4" />{" "}
                  <ProgressBar
                    value={(reviewsByStars[2].length / 5) * 100}
                    className="mt-2 w-[60%]"
                  />
                  {reviewsByStars[2].length}
                </div>
                <div className="flex items-center gap-2">
                  1 <img src={StarIcon} alt="Star Icon" className="h-4 w-4" />{" "}
                  <ProgressBar
                    value={(reviewsByStars[1].length / 5) * 100}
                    className="mt-2 w-[60%]"
                  />
                  {reviewsByStars[1].length}
                </div>
              </div>{" "}
            </div>
          ) : (
            <p className="m-0">No reviews yet!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Restaurant
