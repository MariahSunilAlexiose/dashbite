import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, Table } from "@cmp"
import { PlusIcon } from "@icons"
import { useToast } from "@providers"

import { fetchEndpoint } from "@/constants"

const Categories = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [categories, setCategories] = useState([])

  const fetchData = async () => {
    try {
      const categoryData = await fetchEndpoint("category")
      setCategories(
        categoryData.map((item) => {
          const { image, ...rest } = item
          return {
            image,
            ...rest,
          }
        })
      )
    } catch (err) {
      console.error("Error fetching categories:", err)
      addToast("error", "Error", "Failed to fetch categories!")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="py-10">
      <div className="flex items-center justify-between">
        <h2>Categories</h2>
        <Button
          size="sm"
          variant="success"
          onClick={() =>
            navigate("/add_form", {
              state: {
                tableName: "category",
                toBeAddedKeys: ["image", "name"],
              },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </Button>
      </div>
      <div className="pt-7">
        <Table data={categories} tableName="category" />
      </div>
    </div>
  )
}

export default Categories
