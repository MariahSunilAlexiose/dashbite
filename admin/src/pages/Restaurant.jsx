import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Button, Table } from "@cmp"
import { PencilIcon } from "@icons"
import { useToast } from "@providers"

import {
  backendImgURL,
  fetchCuisines,
  fetchEndpoint,
  fetchRestaurantDishes,
} from "@/constants"

const Restaurant = () => {
  const navigate = useNavigate()
  const { restaurantID } = useParams()
  const [dishes, setDishes] = useState({})
  const [restaurant, setRestaurant] = useState({})
  const [reviews, setReviews] = useState([])
  const [toBeUpdatedRestaurant, setToBeUpdatedRestaurant] = useState({})
  const { addToast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get restaurant
        const restaurantData = await fetchEndpoint(`restaurant/${restaurantID}`)
        const cuisineData = await fetchCuisines(restaurantData)
        const { cuisineIDs, ...rest } = restaurantData // eslint-disable-line no-unused-vars
        setRestaurant({
          ...rest,
          cuisines: cuisineData || {},
        })

        // restaurant details to be updated
        const { address, ...toBeUpdatedRest } = restaurantData
        setToBeUpdatedRestaurant({
          ...toBeUpdatedRest,
          streetAddress: address,
        })

        // get restaurant dishes
        const dishesData = await fetchRestaurantDishes(restaurantData)
        setDishes(
          dishesData.map((dish) => {
            // eslint-disable-next-line no-unused-vars
            const { cuisineIDs, categoryID, restaurantID, image, ...rest } =
              dish
            return {
              image,
              ...rest,
            }
          })
        )

        // get restaurant reviews
        const reviewsData = await fetchEndpoint(
          `review/restaurant/${restaurantID}`
        )
        const updatedReviewsData = await Promise.all(
          reviewsData.map(async (review) => {
            const userData = await fetchEndpoint(`user/${review.userID}`, {
              token: import.meta.env.VITE_ADMIN_TOKEN,
            })

            const { restaurantID, title, comment, ...restOfReviewData } = review // eslint-disable-line no-unused-vars

            return {
              username: userData.name,
              title,
              comment,
              ...restOfReviewData,
            }
          })
        )
        setReviews(updatedReviewsData)
      } catch (err) {
        console.error("Error fetching restaurant:", err)
        addToast("error", "Error", "Failed to fetch restaurant!")
      }
    }

    fetchData()
  }, [restaurantID])

  return (
    <div className="flex flex-col gap-7">
      {restaurant.images && (
        <div>
          <img
            src={`${backendImgURL}/${restaurant.images[0]}`}
            alt="Restaurant Profile"
            className="h-40 w-full rounded-lg object-cover"
          />
          <div className="mt-2 flex gap-2">
            {restaurant.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={`${backendImgURL}/${image}`}
                alt="Restaurant Image"
                className="h-20 w-20 flex-1 rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2>{restaurant.name} Restaurant</h2>
          <div className="flex gap-4">
            {restaurant.cuisines &&
              restaurant.cuisines.map((cuisine) => (
                <div
                  key={cuisine._id}
                  onClick={() => navigate(`/cuisines/${cuisine._id}`)}
                  className="bg-accent text-primary border-primary w-fit cursor-pointer rounded-full border px-2 text-sm"
                >
                  {cuisine.name}
                </div>
              ))}
          </div>
        </div>
        <Button
          size="sm"
          onClick={() =>
            navigate("/update_form", {
              state: {
                tableName: "restaurant",
                dataToBeUpdated: toBeUpdatedRestaurant,
              },
            })
          }
        >
          <img src={PencilIcon} alt="Pencil Icon" className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-between">
        <div>
          <h4>About</h4>
          <div>
            <p className="m-0">{restaurant.website}</p>
            <p className="m-0">{restaurant.email}</p>
            <p className="m-0">{restaurant.phone}</p>
            <p className="m-0">Opening Hours: {restaurant.openingHours}</p>
            <p className="m-0">Rating: {restaurant.rating}</p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="pr-35 flex flex-col">
            <h4>Address</h4>
            {restaurant.address &&
            Object.values(restaurant.address).some(
              (value) => value !== "" && value !== undefined
            ) ? (
              <>
                <p className="m-0">
                  {restaurant.address.street}, {restaurant.address.city},
                </p>
                <p className="m-0">
                  {restaurant.address.state}, {restaurant.address.zipcode},{" "}
                  {restaurant.address.country}
                </p>
              </>
            ) : (
              <>-</>
            )}
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-2">Dishes</h4>

        {dishes.length > 0 ? (
          <Table
            data={dishes}
            tableName="restaurantDish"
            pageID={restaurantID}
          />
        ) : (
          <>No dishes added yet!</>
        )}
      </div>

      <div>
        <h4 className="mb-2">Reviews</h4>
        {reviews.length > 0 ? (
          <Table data={reviews} tableName="review" />
        ) : (
          <>No reviews yet!</>
        )}
      </div>
    </div>
  )
}

export default Restaurant
