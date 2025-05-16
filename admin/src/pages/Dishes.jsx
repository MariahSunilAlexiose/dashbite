import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, Table } from "@cmp"
import { PlusIcon } from "@icons"
import { useToast } from "@providers"

import { fetchEndpoint } from "@/constants"

const Dishes = () => {
  const navigate = useNavigate()
  const [dishes, setDishes] = useState([])
  const [categories, setCategories] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [cuisines, setCuisines] = useState([])
  const { addToast } = useToast()

  const fetchData = async () => {
    try {
      // get dishes
      const dishesData = await fetchEndpoint("dish")
      const [categoriesData, restaurantsData] = await Promise.all([
        fetchEndpoint("category"),
        fetchEndpoint("restaurant"),
      ])
      setCategories(categoriesData)
      setRestaurants(restaurantsData)
      const cleanedDishesData = dishesData.map((item) => {
        const { image, categoryID, cuisineIDs, restaurantID, ...rest } = item // eslint-disable-line no-unused-vars
        return {
          image,
          ...rest,
          categoryName:
            Object.fromEntries(
              categoriesData.map((cat) => [cat._id, cat.name])
            )[categoryID] || "Unknown",
          restaurantName:
            Object.fromEntries(
              restaurantsData.map((res) => [res._id, res.name])
            )[restaurantID] || "-",
        }
      })

      setDishes(cleanedDishesData)

      // get cuisines
      const cuisinesData = await fetchEndpoint("cuisine")
      setCuisines(cuisinesData)
    } catch (err) {
      console.error("Error fetching dishes:", err)
      addToast("error", "Error", "Failed to fetch dishes!")
    }
  }

  useEffect(() => {
    fetchData()
  })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2>Dishes</h2>
        <Button
          size="sm"
          variant="success"
          onClick={() =>
            navigate("/add_form", {
              state: {
                tableName: "dish",
                toBeAddedKeys: [
                  "image",
                  "name",
                  "price",
                  "rating",
                  "restaurant",
                  "category",
                  "cuisines",
                  "description",
                  "servingSize",
                  "ingredients",
                  "calories",
                  "fat",
                  "protein",
                  "carbs",
                  "allergens",
                ],
                data: {
                  restaurants: restaurants,
                  categories: categories,
                  cuisines: cuisines,
                },
              },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </Button>
      </div>
      <Table data={dishes} tableName="dish" />
    </div>
  )
}

export default Dishes
