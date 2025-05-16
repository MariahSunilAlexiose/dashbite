import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { Table } from "@cmp"
import { useToast } from "@providers"

import { fetchEndpoint } from "@/constants"

const Category = () => {
  const { categoryID } = useParams()
  const [category, setCategory] = useState("")
  const [dishes, setDishes] = useState([])
  const { addToast } = useToast()

  const fetchData = async () => {
    try {
      // get category
      const categoryData = await fetchEndpoint(`category/${categoryID}`)
      setCategory(categoryData)

      // get category dishes
      const dishesData = await fetchEndpoint(`category/${categoryID}/dishes`)
      if (dishesData.length > 0) {
        setDishes(
          dishesData.map((item) => {
            // eslint-disable-next-line no-unused-vars
            const { categoryID, cuisineIDs, restaurantID, image, ...rest } =
              item
            return {
              image,
              ...rest,
            }
          })
        )
      }
    } catch (err) {
      console.error("Error fetching category:", err)
      addToast("error", "Error", "Failed to fetch category!")
    }
  }

  useEffect(() => {
    fetchData()
  })

  return (
    <div className="py-10">
      <h2>{category.name} Category Dishes</h2>
      <div className="pt-7">
        <Table data={dishes} tableName="dish" />
      </div>
    </div>
  )
}

export default Category
