import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Button, Table } from "@cmp"
import { PencilIcon } from "@icons"
import { useToast } from "@providers"
import axios from "axios"

import { backendImgURL, backendURL } from "@/constants"

const Restaurant = () => {
  const navigate = useNavigate()
  const { restaurantID } = useParams()
  const [dishes, setDishes] = useState({})
  const [restaurant, setRestaurant] = useState({})
  const [toBeUpdatedRestaurant, setToBeUpdatedRestaurant] = useState({})
  const [address, setAddress] = useState({})
  const { addToast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${backendURL}/restaurant/${restaurantID}`,
          {
            headers: {
              token: import.meta.env.VITE_ADMIN_TOKEN,
            },
          }
        )

        setRestaurant(res.data.data)
        const { __v, createdAt, updatedAt, address, ...rest } = res.data.data // eslint-disable-line no-unused-vars
        setToBeUpdatedRestaurant({
          streetAddress: address,
          ...rest,
        })

        setAddress(res.data.data.address)

        if (res.data.success) {
          const dishResponses = await Promise.all(
            res.data.data.dishIDs.map((itemID) =>
              axios.get(`${backendURL}/dish/${itemID}`)
            )
          )

          const filteredDishes = dishResponses.map(({ data }) => {
            const {
              /* eslint-disable no-unused-vars */
              __v,
              createdAt,
              updatedAt,
              cuisineIDs,
              restaurantID,
              /* eslint-enable no-unused-vars */
              image,
              ...rest
            } = data.data

            return {
              image,
              ...rest,
            }
          })

          setDishes(filteredDishes)
        }
      } catch (err) {
        console.error(err)
        addToast("error", "Error", `Error in retrieving: ${err}`)
      }
    }

    fetchData()
  }, [restaurantID])

  return (
    <div className="flex flex-col gap-7">
      {restaurant.image && (
        <img
          src={`${backendImgURL}/${restaurant.image}`}
          alt="Restaurant Profile"
          className="h-40 w-full object-cover"
        />
      )}
      <div className="flex items-center justify-between">
        <h2>{restaurant.name} Restaurant</h2>
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
            {address &&
            Object.values(address).some(
              (value) => value !== "" && value !== undefined
            ) ? (
              <>
                <p className="m-0">
                  {address.street}, {address.city},
                </p>
                <p className="m-0">
                  {address.state}, {address.zipcode}, {address.country}
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
          <Table data={dishes} tableName="dish" />
        ) : (
          <>No dishes added yet!</>
        )}
      </div>
    </div>
  )
}

export default Restaurant
