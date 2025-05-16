import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { Table } from "@cmp"
import { useToast } from "@providers"

import { backendImgURL, fetchEndpoint } from "@/constants"

const Cuisine = () => {
  const { cuisineID } = useParams()
  const [cuisine, setCuisine] = useState({})
  const [dishes, setDishes] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const { addToast } = useToast()

  const fetchData = async () => {
    try {
      // get cuisine
      const cuisineData = await fetchEndpoint(`cuisine/${cuisineID}`)
      setCuisine(cuisineData)

      // get cuisine dishes
      const dishesData = await fetchEndpoint(`cuisine/${cuisineID}/dishes`)
      if (dishesData) {
        const cleanedDishesData = await Promise.all(
          dishesData.map(async (item) => {
            // eslint-disable-next-line no-unused-vars
            const { image, categoryID, cuisineIDs, restaurantID, ...rest } =
              item
            return {
              image,
              ...rest,
            }
          })
        )
        setDishes(cleanedDishesData)
      }

      // get cuisine restaurants
      const restaurantsData = await fetchEndpoint(
        `cuisine/${cuisineID}/restaurants`
      )
      if (restaurantsData) {
        const cleanedRestaurantsData = await Promise.all(
          restaurantsData.map(async (item) => {
            const {
              /* eslint-disable no-unused-vars */
              email,
              cuisineIDs,
              website,
              openingHours,
              dishIDs,
              phone,
              /* eslint-enable no-unused-vars */
              images,
              address,
              ...rest
            } = item
            const addressValues = [
              address?.street,
              address?.city,
              address?.state,
              address?.zipcode,
              address?.country,
            ].filter((value) => value && value.trim() !== "")

            return {
              image: images[0],
              ...rest,
              address: addressValues.length > 0 ? addressValues.join(", ") : "", // Join only non-empty values
            }
          })
        )
        setRestaurants(cleanedRestaurantsData)
      }
    } catch (err) {
      console.error("Error fetching cuisines:", err)
      addToast("error", "Error", "Failed to fetch cuisines!")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="flex flex-col gap-7">
      <img
        src={`${backendImgURL}/${cuisine.image}`}
        alt="Cuisine Image"
        className="h-40 w-full rounded-lg object-cover"
      />
      <h2 className="text-center">{cuisine.name} Cuisine </h2>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2>Restaurants</h2>
        </div>
        {restaurants && restaurants.length > 0 ? (
          <Table data={restaurants} tableName="restaurant" />
        ) : (
          "No Restaurants added yet!"
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2>Dishes</h2>
        </div>
        {dishes && dishes.length > 0 ? (
          <Table data={dishes} tableName="dish" />
        ) : (
          "No Dishes added yet!"
        )}
      </div>
    </div>
  )
}

export default Cuisine
