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
  UserIcon,
} from "@icons"
import { useTheme, useToast } from "@providers"
import axios from "axios"

import { formatDate } from "@/constants"

const Dish = () => {
  const { dishID } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { addToast } = useToast()
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext)
  const [dish, setDish] = useState({})
  const [reviews, setReviews] = useState([])
  const cartItemCount =
    cartItems && cartItems[dish._id] !== undefined ? cartItems[dish._id] : 0

  const fetchDish = async () => {
    try {
      const res = await axios.get(`${url}/api/dish/${dishID}`)
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }

      const filteredData = res.data.data || {}

      const restRes = await axios.get(
        `${url}/api/restaurant/${res.data.data.restaurantID}`
      )
      if (!restRes.data.success) {
        console.error(restRes.data.message)
        return addToast("error", "Error", restRes.data.message)
      }
      filteredData.restaurantName = restRes.data.data.name

      const cuisineArray = await Promise.all(
        res.data.data.cuisineIDs.map(async (cuisineID) => {
          const cuisineRes = await axios.get(`${url}/api/cuisine/${cuisineID}`)
          if (!cuisineRes.data.success) {
            console.error(cuisineRes.data.message)
            return addToast("error", "Error", cuisineRes.data.message)
          }
          return { id: cuisineID, name: cuisineRes.data.data.name }
        })
      )
      filteredData.cuisines = cuisineArray

      const catRes = await axios.get(
        `${url}/api/category/${res.data.data.categoryID}`
      )
      if (!catRes.data.success) {
        console.error(catRes.data.message)
        return addToast("error", "Error", catRes.data.message)
      }
      filteredData.categoryName = catRes.data.data.name

      setDish(filteredData)

      const revRes = await axios.get(`${url}/api/review/dish/${dishID}`)
      if (!revRes.data.success) {
        console.error(revRes.data.message)
        return addToast("error", "Error", revRes.data.message)
      }

      const updatedReviews = await Promise.all(
        revRes.data.map(async (item) => {
          const itemRes = await axios.get(`${url}/api/user/${item.userID}`)
          if (!itemRes.data.success) {
            console.error(itemRes.data.message)
            return addToast("error", "Error", itemRes.data.message)
          }
          return {
            ...item,
            username: itemRes.data.user.name,
            profilePic: itemRes.data.user.profilePic,
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
        onClick={() => navigate(`/restaurants/${dish.restaurantID}`)}
      >
        <p>{dish.restaurantName}</p>
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
                <p className="m-0 text-sm">{dish.categoryName}</p>
              </div>
              <div className="flex gap-10">
                <h2>{dish.name}</h2>
                <div className="flex items-center gap-1">
                  <img src={StarIcon} alt="Star Icon" className="h-4 w-4" />
                  {dish.rating}
                </div>
              </div>
              {dish.cuisines &&
                dish.cuisines.map((cuisine) => (
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
                <div className="dark:bg-blue-30 cursor-pointer rounded-full bg-white p-1 shadow-md">
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
          <div className="h-30 bg-accent flex items-center justify-between rounded-2xl p-5">
            <div className="flex h-full w-full flex-col items-center justify-center">
              <p className="text-gray-20 font-semibold">Serving Size</p>
              <div className="flex items-end gap-1">
                <p className="text-xl">{dish.servingSize}</p>
              </div>
            </div>
            <Separator orientation="vertical" />
            <div className="flex h-full w-full flex-col items-center justify-center">
              <p className="text-gray-20 font-semibold">Calories</p>
              <div className="flex items-end gap-1">
                <p className="text-xl">320</p>
                <p className="text-xl">{dish.calories}</p>
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
          <div>
            <h4 className="mb-3">Allergens</h4>
            {dish.allergens &&
              dish.allergens.map((allergen) => (
                <div
                  key={allergen}
                  onClick={() => navigate(`/cuisine/${allergen}`)}
                  className="bg-accent text-gray-20 w-fit cursor-pointer border px-2 text-sm"
                >
                  {allergen}
                </div>
              ))}
          </div>
          {/* Reviews */}
          <div>
            <h4 className="mb-3">Reviews</h4>
            <div className="mt-6 flex gap-1.5 overflow-x-scroll">
              {reviews &&
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="min-w-[350px] rounded-2xl bg-white p-5 dark:bg-black"
                  >
                    <div className="mb-5 flex gap-2">
                      <div className="h-15 w-15 relative flex shrink-0 items-center justify-center overflow-hidden rounded-full">
                        <img
                          src={
                            review.profilePic &&
                            review.profilePic.startsWith(
                              "https://ui-avatars.com/api/?name="
                            )
                              ? review.profilePic
                              : `${url}/images/${review.profilePic || UserIcon}`
                          }
                          alt="User Profile"
                          className="aspect-square h-full w-full object-cover"
                        />
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between">
                          <p className="m-0">{review.username}</p>
                          <p className="text-gray-20 m-0 text-xs">
                            {formatDate(review.updatedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <img
                            src={StarIcon}
                            alt="Star Icon"
                            className="h-4 w-4"
                          />
                          {dish.rating}
                        </div>
                      </div>
                    </div>
                    {review.comment}
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* Ingredients */}
        <div className="w-1/4 p-3">
          <h4 className="mt-2 text-center">Main Ingredients</h4>
          <div className="mt-3">
            <ul className="space-y-2">
              <li className="before:bg-border relative pl-6 before:absolute before:left-0 before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full">
                Mango
              </li>
              <li className="before:bg-border relative pl-6 before:absolute before:left-0 before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full">
                Mango
              </li>
              <li className="before:bg-border relative pl-6 before:absolute before:left-0 before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full">
                Mango
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dish
