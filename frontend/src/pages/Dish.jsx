import React, { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Separator } from "@cmp"
import { dark, StoreContext } from "@context"
import {
  ChevronRightIcon,
  ChevronRightWhiteIcon,
  MinusIcon,
  PlusDarkIcon,
  PlusIcon,
  StarIcon,
  TagIcon,
} from "@icons"
import { useTheme, useToast } from "@providers"
import { Reviews } from "@sections"

import { fetchEndpoint } from "@/constants"

const Dish = () => {
  const { dishID } = useParams()
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext)
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { addToast } = useToast()
  const [dish, setDish] = useState({})
  const [reviews, setReviews] = useState([])
  const cartItemCount =
    cartItems && cartItems[dish._id] !== undefined ? cartItems[dish._id] : 0

  const fetchDish = async () => {
    try {
      const dishData = await fetchEndpoint(url, `dish/${dishID}`)
      const restaurantData = await fetchEndpoint(
        url,
        `restaurant/${dishData.restaurantID}`
      )
      const cuisinesData = await Promise.all(
        dishData.cuisineIDs.map(async (cuisineID) => {
          const cuisineData = await fetchEndpoint(url, `cuisine/${cuisineID}`)
          return { id: cuisineID, name: cuisineData.name }
        })
      )
      const categoryData = await fetchEndpoint(
        url,
        `category/${dishData.categoryID}`
      )
      setDish({
        ...dishData,
        restaurant: restaurantData,
        cuisines: cuisinesData,
        category: categoryData,
      })

      // get reviews
      const reviewsData = await fetchEndpoint(url, `review/dish/${dishID}`)

      // get user for each review
      const updatedReviews = await Promise.all(
        reviewsData.map(async (review) => {
          const userData = await fetchEndpoint(url, `user/${review.userID}`)
          return {
            ...review,
            user: userData,
          }
        })
      )
      setReviews(updatedReviews)
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
      <div
        className="mt-3 flex cursor-pointer items-center"
        onClick={() => navigate(`/restaurant/${dish.restaurantID}`)}
      >
        <p>{dish.restaurant?.name}</p>
        <img
          src={theme === dark ? ChevronRightWhiteIcon : ChevronRightIcon}
          alt="Chevron Right Icon"
          className="h-4 w-4"
        />
      </div>
      <img
        src={`${url}/images/${dish.image}`}
        alt={dish.name}
        className="h-80 w-full rounded-2xl object-cover"
      />
      <div className="flex gap-5">
        {/* Dish Information */}
        <div className="flex w-3/4 flex-col gap-5 p-3">
          {/* Dish Brief Info */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1">
                <img src={TagIcon} alt="Tag Icon" className="h-4 w-4" />
                <p className="m-0 text-sm">{dish.category?.name}</p>
              </div>
              <div className="flex gap-10">
                <h2>{dish.name}</h2>
                <div className="flex items-center gap-1">
                  <img src={StarIcon} alt="Star Icon" className="h-4 w-4" />
                  {dish.rating}
                </div>
              </div>
              {dish.cuisines?.map((cuisine) => (
                <div
                  key={cuisine._id}
                  onClick={() => navigate(`/cuisine/${cuisine.id}`)}
                  className="bg-accent text-primary border-primary w-fit cursor-pointer rounded-full border px-2 text-sm"
                >
                  {cuisine.name}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 text-center">
              <h3>${dish.price}</h3>
              {cartItemCount == 0 ? (
                <div className="dark:bg-blue-30 flex cursor-pointer justify-center rounded-full bg-white p-1 shadow-md">
                  <img
                    src={PlusIcon}
                    alt="Plus Icon"
                    className="h-5 w-5"
                    onClick={() => addToCart(dish._id)}
                  />
                </div>
              ) : (
                <div className="">
                  <div className="dark:bg-blue-30 flex items-center justify-center gap-2 rounded-full bg-white p-2">
                    <div className="bg-red-10 cursor-pointer rounded-full p-1">
                      <img
                        src={MinusIcon}
                        alt="Minus Icon"
                        className="h-5 w-5 cursor-pointer"
                        onClick={() => removeFromCart(dish._id)}
                      />
                    </div>
                    <p className="text-blue-90 m-0 p-0">{cartItemCount}</p>
                    <div className="bg-accent cursor-pointer rounded-full p-1">
                      <img
                        src={PlusDarkIcon}
                        alt="Plus Icon"
                        className="h-5 w-5 cursor-pointer"
                        onClick={() => addToCart(dish._id)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Description */}
          <p className="m-0">{dish.description}</p>
          {/* Calorie Card */}
          <div className="h-30 bg-accent flex items-center justify-between rounded-2xl p-3">
            <div className="flex h-full w-full flex-col items-center justify-center p-2">
              <p className="text-gray-20 font-semibold">Serving Size</p>
              <div className="flex items-end gap-1">
                <p>{dish.servingSize}</p>
              </div>
            </div>
            <Separator orientation="vertical" />
            <div className="flex h-full w-full flex-col items-center justify-center">
              <p className="text-gray-20 font-semibold">Calories</p>
              <div className="flex items-end gap-1">
                <p className="text-xl">{dish.calories}</p>
                <p className="text-gray-20 m-0 text-xs">cal</p>
              </div>
            </div>
            <Separator orientation="vertical" />
            <div className="flex h-full w-full flex-col items-center justify-center">
              <p className="text-gray-20 font-semibold">Proteins</p>
              <div className="flex items-end gap-1">
                <p className="text-xl">{dish.protein}</p>
                <p className="text-gray-20 m-0 text-xs">gram</p>
              </div>
            </div>
            <Separator orientation="vertical" />
            <div className="flex h-full w-full flex-col items-center justify-center">
              <p className="text-gray-20 font-semibold">Fat</p>
              <div className="flex items-end gap-1">
                <p className="text-xl">{dish.fat}</p>
                <p className="text-gray-20 m-0 text-xs">gram</p>
              </div>
            </div>
            <Separator orientation="vertical" />
            <div className="flex h-full w-full flex-col items-center justify-center">
              <p className="text-gray-20 font-semibold">Carbs</p>
              <div className="flex items-end gap-1">
                <p className="text-xl">{dish.carbs}</p>
                <p className="text-gray-20 m-0 text-xs">gram</p>
              </div>
            </div>
          </div>
          {/* Allergens */}
          {dish.allergens?.length > 0 && (
            <div>
              <h4 className="mb-3">Allergens</h4>
              <div className="flex gap-3">
                {dish.allergens.map((allergen) => (
                  <div
                    key={allergen}
                    onClick={() => navigate(`/cuisine/${allergen}`)}
                    className="bg-accent text-gray-20 w-fit cursor-pointer border px-2 text-sm"
                  >
                    {allergen}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Reviews */}
          <Reviews reviews={reviews} page="dish" pageID={dishID} />
        </div>
        {/* Ingredients */}
        <div className="w-1/4 p-3">
          <h4 className="mt-2 text-center">Main Ingredients</h4>
          <div className="mt-3">
            <ul className="space-y-2">
              {dish.ingredients?.map((ingredient, index) => (
                <li
                  key={`${ingredient}-${index}`}
                  className="before:bg-border relative pl-6 before:absolute before:left-0 before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full"
                >
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dish
