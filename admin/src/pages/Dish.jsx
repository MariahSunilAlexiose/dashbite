import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Button, Separator, Table } from "@cmp"
import { ChevronRightIcon, PencilIcon, TagIcon } from "@icons"
import { useToast } from "@providers"

import {
  backendImgURL,
  fetchCuisines,
  fetchEndpoint,
  getRatingImage,
} from "@/constants"

const Cuisine = () => {
  const navigate = useNavigate()
  const { dishID } = useParams()
  const [dish, setDish] = useState({})
  const [reviews, setReviews] = useState([])
  const { addToast } = useToast()

  const fetchData = async () => {
    try {
      // get dish
      const dishData = await fetchEndpoint(`dish/${dishID}`)
      const restaurantData = await fetchEndpoint(
        `restaurant/${dishData.restaurantID}`
      )
      const categoryData = await fetchEndpoint(
        `category/${dishData.categoryID}`
      )
      const cuisineData = await fetchCuisines(dishData)
      setDish({
        ...dishData,
        restaurant: restaurantData || {},
        category: categoryData || {},
        cuisines: cuisineData || [],
      })

      // get dish reviews
      const reviewData = await fetchEndpoint(`review/dish/${dishID}`)
      if (reviewData.length > 0) {
        const reviewsWithUsernames = await Promise.all(
          reviewData.map(
            // eslint-disable-next-line no-unused-vars
            async ({ __v, createdAt, updatedAt, dishID, ...rest }) => {
              return {
                username:
                  (await fetchEndpoint(`user/${rest.userID}`).name) ||
                  "Unknown",
                ...rest,
              }
            }
          )
        )
        setReviews(reviewsWithUsernames)
      }
    } catch (err) {
      console.error("Error fetching dishes:", err)
      addToast("error", "Error", "Failed to fetch dishes!")
    }
  }

  useEffect(() => {
    fetchData()
  })

  return (
    <div className="flex flex-col gap-3 py-10">
      {/* Restaurant */}
      {dish.restaurant && (
        <div
          className="flex cursor-pointer items-center"
          onClick={() => navigate(`/restaurants/${dish.restaurantID}`)}
        >
          <p className="m-0 text-xs">{dish.restaurant.name}</p>
          <img
            src={ChevronRightIcon}
            alt="Chevron Right Icon"
            className="h-4 w-4"
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-10">
        {/* Dish Image */}
        <img
          src={`${backendImgURL}/${dish.image}`}
          alt={dish.name}
          className="h-24 w-24 object-cover"
        />

        {/* Dish Details */}
        <div className="flex flex-1 justify-between">
          <div className="flex flex-col gap-1">
            {/* Category */}
            {dish.category && (
              <div
                onClick={() => navigate(`/categories/${dish.categoryID}`)}
                className="flex cursor-pointer items-center gap-1"
              >
                <img src={TagIcon} alt="Tag Icon" className="h-4 w-4" />
                <p className="m-0 text-xs">{dish.category.name}</p>
              </div>
            )}

            {/* Dish Name */}
            <h2>{dish.name}</h2>

            {/* Cuisines */}
            <div className="flex gap-4">
              {dish.cuisines &&
                dish.cuisines.map((cuisine) => (
                  <div
                    key={cuisine._id}
                    onClick={() => navigate(`/cuisines/${cuisine._id}`)}
                    className="bg-accent text-primary border-primary w-fit cursor-pointer rounded-full border px-2 text-sm"
                  >
                    {cuisine.name}
                  </div>
                ))}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <img
                src={getRatingImage(dish.rating)}
                alt="Rating Icon"
                className="h-4 w-20"
              />
              {dish.rating}
            </div>
          </div>

          {/* Price */}
          <div className="flex">
            <p className="mt-5 text-sm">$</p>
            <p className="text-2xl">{dish.price}</p>
          </div>
        </div>

        {/* Update Button */}
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

      <div className="flex gap-5">
        {/* Description + Calorie Card + Allergens */}
        <div className="flex w-3/4 flex-col gap-3">
          {/* Description */}
          <div>
            <h4>Description</h4>
            <p className="m-0">{dish.description}</p>
          </div>
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="flex flex-col gap-2">
              <h5 className="font-black">Allergens:</h5>
              <div className="flex gap-4">
                {dish.allergens.map((allergen) => (
                  <div
                    key={allergen}
                    className="bg-border text-gray-20 w-fit cursor-pointer border px-2 text-sm"
                  >
                    {allergen}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Calorie Card */}
          <div className="bg-accent flex h-20 items-center justify-between rounded-2xl p-3">
            {dish.servingSize && (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <p className="text-gray-20 font-semibold">Serving Size</p>
                <div className="flex items-end gap-1">
                  <p className="text-xl">{dish.servingSize}</p>
                </div>
              </div>
            )}
            {dish.calories && (
              <>
                <Separator orientation="vertical" />
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <p className="text-gray-20 font-semibold">Calories</p>
                  <div className="flex items-end gap-1">
                    <p className="text-xl">{dish.calories}</p>
                    <p className="text-gray-20 m-0 text-xs">kCal</p>
                  </div>
                </div>
              </>
            )}
            {dish.protein && (
              <>
                <Separator orientation="vertical" />
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <p className="text-gray-20 font-semibold">Proteins</p>
                  <div className="flex items-end gap-1">
                    <p className="text-xl">{dish.protein}</p>
                    <p className="text-gray-20 m-0 text-xs">gram</p>
                  </div>
                </div>
              </>
            )}
            {dish.fat && (
              <>
                <Separator orientation="vertical" />
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <p className="text-gray-20 font-semibold">Fat</p>
                  <div className="flex items-end gap-1">
                    <p className="text-xl">{dish.fat}</p>
                    <p className="text-gray-20 m-0 text-xs">gram</p>
                  </div>
                </div>
              </>
            )}
            {dish.carbs && (
              <>
                <Separator orientation="vertical" />
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <p className="text-gray-20 font-semibold">Carbs</p>
                  <div className="flex items-end gap-1">
                    <p className="text-xl">{dish.carbs}</p>
                    <p className="text-gray-20 m-0 text-xs">gram</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {/* Ingredients */}
        {dish.ingredients && dish.ingredients.length > 0 && (
          <div className="w-1/4 rounded-xl border p-4">
            <h4>Main Ingredients</h4>
            <div className="mt-3">
              <ul className="space-y-2">
                {dish.ingredients.map((ingredient) => (
                  <li
                    key={ingredient}
                    className="before:bg-border relative pl-6 before:absolute before:left-0 before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full"
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      {/* Reviews */}
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

export default Cuisine
