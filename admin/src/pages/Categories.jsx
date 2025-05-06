import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, Table } from "@cmp"
import { PlusIcon } from "@icons"
import { useToast } from "@providers"
import axios from "axios"

import { backendURL } from "@/constants"

const Categories = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const { addToast } = useToast()

  const fetchData = async () => {
    try {
      const res = await axios.get(`${backendURL}/category/`, {
        headers: {
          token: import.meta.env.VITE_ADMIN_TOKEN,
        },
      })

      const filteredData = res.data.data.map((item) => {
        const { __v, image, createdAt, updatedAt, ...rest } = item // eslint-disable-line no-unused-vars
        return {
          image,
          ...rest,
        }
      })

      setCategories(filteredData)
    } catch (err) {
      console.error(err)
      addToast("error", "Error", `Error in listing category: ${err}`)
    }
  }

  useEffect(() => {
    fetchData()
  })

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
