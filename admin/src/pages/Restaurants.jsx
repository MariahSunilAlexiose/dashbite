import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, Table } from "@cmp"
import { PlusIcon } from "@icons"
import { useToast } from "@providers"
import axios from "axios"

import { backendURL } from "@/constants"

const Restaurants = () => {
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])
  const { addToast } = useToast()

  const fetchData = async () => {
    try {
      const res = await axios.get(`${backendURL}/restaurant/`)
      const cleanedRestaurantsData = await Promise.all(
        res.data.data.map(async (item) => {
          const {
            /* eslint-disable no-unused-vars */
            __v,
            createdAt,
            updatedAt,
            image,
            dishIDs,
            /* eslint-enable no-unused-vars */
            address,
            ...rest
          } = item
          const newAddress = `${address.street}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}`
          return {
            image,
            ...rest,
            address:
              address &&
              typeof address === "object" &&
              Object.keys(address).length > 0 &&
              Object.values(address).every(
                (value) => value !== "" && value !== undefined
              )
                ? newAddress
                : "",
          }
        })
      )
      setRestaurants(cleanedRestaurantsData)
    } catch (err) {
      console.error(err)
      addToast("error", "Error", `Error in listing restaurants: ${err}`)
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
          size="sm"
          variant="success"
          onClick={() =>
            navigate("/add_form", {
              state: {
                tableName: "restaurant",
                toBeAddedKeys: [
                  "images",
                  "name",
                  "phone",
                  "dishName",
                  "email",
                  "cuisines",
                  "website",
                  "openingHours",
                  "rating",
                  "streetAddress",
                ],
              },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </Button>
      </div>
      <div className="pt-7">
        <Table data={restaurants} tableName="restaurant" />
      </div>
    </div>
  )
}

export default Restaurants
