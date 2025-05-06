import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, Table } from "@cmp"
import { PlusIcon } from "@icons"
import { useToast } from "@providers"
import axios from "axios"

import { backendURL } from "@/constants"

const Dishes = () => {
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const { addToast } = useToast()

  const fetchList = async () => {
    try {
      const res = await axios.get(`${backendURL}/dish/`, {
        headers: {
          token: import.meta.env.VITE_ADMIN_TOKEN,
        },
      })
      const cleanedDishesData = await Promise.all(
        res.data.data.map(async (item) => {
          const itemRes = await axios.get(
            `${backendURL}/category/${item.categoryID}`
          )
          const { __v, image, ...rest } = item // eslint-disable-line no-unused-vars
          return {
            image,
            ...rest,
            category: itemRes.data.data.name || "Unknown",
          }
        })
      )
      setList(cleanedDishesData)
    } catch (err) {
      console.error(err)
      addToast("error", "Error", `Error in listing dish: ${err}`)
    }
  }

  useEffect(() => {
    fetchList()
  })

  return (
    <div className="py-10">
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
                  "category",
                  "name",
                  "description",
                  "price",
                  "rating",
                ],
              },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </Button>
      </div>
      <div className="pt-7">
        <Table data={list} tableName="dish" />
      </div>
    </div>
  )
}

export default Dishes
