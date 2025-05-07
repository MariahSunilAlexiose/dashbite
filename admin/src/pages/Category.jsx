import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { Table } from "@cmp"
import { useToast } from "@providers"
import axios from "axios"

import { backendURL } from "@/constants"

const Category = () => {
  const { categoryID } = useParams()
  const [category, setCategory] = useState("")
  const [dishes, setDishes] = useState([])
  const { addToast } = useToast()

  const fetchList = async () => {
    try {
      const catRes = await axios.get(`${backendURL}/category/${categoryID}`, {
        headers: {
          token: import.meta.env.VITE_ADMIN_TOKEN,
        },
      })
      setCategory(catRes.data.data.name)
      const res = await axios.get(
        `${backendURL}/category/${categoryID}/dishes/`,
        {
          headers: {
            token: import.meta.env.VITE_ADMIN_TOKEN,
          },
        }
      )
      if (res.data.success) {
        const filteredDishes = res.data.data.map((item) => {
          const { __v, image, createdAt, updatedAt, cuisineIDs, ...rest } = item // eslint-disable-line no-unused-vars

          return {
            image,
            ...rest,
          }
        })
        setDishes(filteredDishes)
      }
    } catch (err) {
      console.error(err)
      addToast("error", "Error", `Error in retrieiving dishes: ${err}`)
    }
  }

  useEffect(() => {
    fetchList()
  })

  return (
    <div className="py-10">
      <h2>{category} Category Dishes</h2>
      <div className="pt-7">
        <Table data={dishes} tableName="dish" />
      </div>
    </div>
  )
}

export default Category
