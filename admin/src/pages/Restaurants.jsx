import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, Table } from "@cmp"
import { PlusIcon } from "@icons"
import { useToast } from "@providers"

import { fetchEndpoint } from "@/constants"

const Restaurants = () => {
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])
  const { addToast } = useToast()

  const fetchData = async () => {
    try {
      // get restaurants
      const restaurantsData = await fetchEndpoint("restaurant")
      const cleanedRestaurantsData = await Promise.all(
        restaurantsData.map(async (item) => {
          const {
            /* eslint-disable no-unused-vars */
            dishIDs,
            openingHours,
            website,
            email,
            phone,
            cuisineIDs,
            images,
            /* eslint-enable no-unused-vars */ address,
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
    } catch (err) {
      console.error("Error fetching restaurants:", err)
      addToast("error", "Error", "Failed to fetch restaurants!")
    }
  }

  useEffect(() => {
    fetchData()
  })

  return (
    <div className="py-10">
      <div className="flex items-center justify-between">
        <h2>Restaurants</h2>
        <Button
          variant="success"
          size="sm"
          onClick={() =>
            navigate("/add_form", {
              state: {
                tableName: "restaurant",
                toBeAddedKeys: [
                  "images",
                  "name",
                  "phone",
                  "rating",
                  "email",
                  "website",
                  "description",
                  "openingHours",
                  "cuisines",
                  "streetAddress",
                ],
              },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </Button>
      </div>
      {restaurants && (
        <div className="pt-7">
          <Table data={restaurants} tableName="restaurant" />
        </div>
      )}
    </div>
  )
}

export default Restaurants
