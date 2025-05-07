import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Button, Table } from "@cmp"
import { PlusIcon } from "@icons"
import { useToast } from "@providers"
import axios from "axios"

import { backendURL } from "@/constants"

const Cuisine = () => {
  const navigate = useNavigate()
  const { cuisineID } = useParams()
  const [cuisine, setCuisine] = useState("")
  const [dishes, setDishes] = useState([])
  const { addToast } = useToast()

  const fetchList = async () => {
    try {
      const catRes = await axios.get(`${backendURL}/cuisine/${cuisineID}`, {
        headers: {
          token: import.meta.env.VITE_ADMIN_TOKEN,
        },
      })
      setCuisine(catRes.data.data.name)
      const res = await axios.get(
        `${backendURL}/cuisine/${cuisineID}/dishes/`,
        {
          headers: {
            token: import.meta.env.VITE_ADMIN_TOKEN,
          },
        }
      )
      if (res.data.success) {
        const filteredDishes = res.data.data.map((item) => {
          const { __v, image, createdAt, updatedAt, ...rest } = item // eslint-disable-line no-unused-vars

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
      <div className="flex items-center justify-between">
        <h2>{cuisine} Cuisine</h2>
        <Button
          size="sm"
          variant="success"
          onClick={() =>
            navigate("/add_form", {
              state: {
                tableName: "cuisineDish",
                pageID: cuisineID,
                toBeAddedKeys: ["dishName"],
              },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </Button>
      </div>
      <div className="pt-7">
        <Table data={dishes} tableName="cuisineDish" pageID={cuisineID} />
      </div>
    </div>
  )
}

export default Cuisine
