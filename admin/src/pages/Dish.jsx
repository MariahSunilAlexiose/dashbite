import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Button, Table } from "@cmp"
import { ChevronRightIcon, MapPinIcon, PencilIcon } from "@icons"
import { useToast } from "@providers"
import axios from "axios"

import { backendImgURL, backendURL, ratings } from "@/constants"

const Cuisine = () => {
  const navigate = useNavigate()
  const { dishID } = useParams()
  const [dish, setDish] = useState({})
  const [reviews, setReviews] = useState([])
  const { addToast } = useToast()

  const getRatingImage = (dishRating) => {
    const rating = ratings.find((r) => r.number === Math.round(dishRating))
    return rating ? rating.image : null
  }

  const fetchData = async () => {
    try {
      let filteredData
      const catRes = await axios.get(`${backendURL}/dish/${dishID}`)
      const { __v, updatedAt, createdAt, _id, ...rest } = catRes.data.data // eslint-disable-line no-unused-vars
      filteredData = { ...rest }
      if (catRes.data.data.restaurantID) {
        const restRes = await axios.get(
          `${backendURL}/restaurant/${catRes.data.data.restaurantID}`
        )
        filteredData.restaurantName = restRes.data.data.name
      }
      if (catRes.data.data.categoryID) {
        const restRes = await axios.get(
          `${backendURL}/category/${catRes.data.data.categoryID}`
        )
        filteredData.categoryName = restRes.data.data.name
      }
      if (catRes.data.data.cuisineIDs) {
        const cuisineNames = await Promise.all(
          catRes.data.data.cuisineIDs.map(async (cuisineID) => {
            const cuisineRes = await axios.get(
              `${backendURL}/cuisine/${cuisineID}`
            )
            return cuisineRes.data.data.name
          })
        )
        filteredData.cuisineNames = cuisineNames
      }
      setDish(filteredData)
      const res = await axios.get(`${backendURL}/review/dish/${dishID}/`)
      if (res.data.length > 0) {
        const reviewsWithUsernames = await Promise.all(
          res.data.map(
            // eslint-disable-next-line no-unused-vars
            async ({ __v, createdAt, updatedAt, dishID, ...rest }) => {
              const userRes = await axios.get(
                `${backendURL}/user/${rest.userID}`,
                {
                  headers: {
                    token: import.meta.env.VITE_ADMIN_TOKEN,
                  },
                }
              )
              return { username: userRes.data.user.name, ...rest }
            }
          )
        )
        setReviews(reviewsWithUsernames)
      }
    } catch (err) {
      console.error(err)
      addToast("error", "Error", `Error in retrieiving reviews: ${err}`)
    }
  }

  useEffect(() => {
    fetchData()
  })

  return (
    <div className="py-10">
      <div
        className="flex cursor-pointer items-center pb-5"
        onClick={() => navigate(`/categories/${dish.categoryID}`)}
      >
        <div>{dish.categoryName}</div>
        <img
          src={ChevronRightIcon}
          alt="Chevron Right Icon"
          className="h-4 w-4"
        />
      </div>
      <div className="flex justify-between gap-10">
        <img
          src={`${backendImgURL}/${dish.image}`}
          alt={dish.name}
          className="h-24 w-24 object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              {dish.restaurantName && (
                <div
                  className="flex cursor-pointer items-center"
                  onClick={() => navigate(`/restaurants/${dish.restaurantID}`)}
                >
                  <img src={MapPinIcon} alt="MapPinIcon" className="h-4 w-4" />
                  <p className="m-0 text-xs">{dish.restaurantName}</p>
                </div>
              )}
              <h2>{dish.name}</h2>
            </div>
            <div className="flex items-center gap-1">
              <img
                src={getRatingImage(dish.rating)}
                alt="Rating Icon"
                className="h-4 w-20"
              />
              {dish.rating}
            </div>
          </div>
          <div className="flex gap-4">
            {dish.cuisineIDs &&
              dish.cuisineNames &&
              dish.cuisineIDs.map((cuisineID, index) => (
                <div
                  key={cuisineID}
                  onClick={() => navigate(`/cuisines/${cuisineID}`)}
                  className="bg-accent text-primary border-primary w-fit cursor-pointer rounded-full border px-2 text-sm"
                >
                  {dish.cuisineNames[index]}{" "}
                </div>
              ))}
          </div>
          <p className="m-0">{dish.description}</p>
          <p className="m-0">${dish.price}</p>
        </div>
        <Button
          size="sm"
          onClick={() =>
            navigate("/update_form", {
              state: {
                tableName: "dish",
                dataToBeUpdated: dish,
              },
            })
          }
        >
          <img src={PencilIcon} alt="Pencil Icon" className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <p></p>
      </div>
      <div className="pt-7">
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

export default Cuisine
