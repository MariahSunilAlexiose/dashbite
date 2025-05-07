import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, Table } from "@cmp"
import { PlusIcon } from "@icons"
import { useToast } from "@providers"
import axios from "axios"

import { backendURL } from "@/constants"

const Cuisines = () => {
  const navigate = useNavigate()
  const [cuisines, setCuisines] = useState([])
  const { addToast } = useToast()

  const fetchData = async () => {
    try {
      const res = await axios.get(`${backendURL}/cuisine/`)
      const cleanedCuisinesData = await Promise.all(
        res.data.data.map(async (item) => {
          const { __v, createdAt, updatedAt, dishIDs, image, ...rest } = item // eslint-disable-line no-unused-vars
          return {
            image,
            ...rest,
          }
        })
      )
      setCuisines(cleanedCuisinesData)
    } catch (err) {
      console.error(err)
      addToast("error", "Error", `Error in listing cuisines: ${err}`)
    }
  }

  useEffect(() => {
    fetchData()
  })

  return (
    <div className="py-10">
      <div className="flex items-center justify-between">
        <h2>Cuisines</h2>
        <Button
          size="sm"
          variant="success"
          onClick={() =>
            navigate("/add_form", {
              state: {
                tableName: "cuisine",
                toBeAddedKeys: ["image", "name"],
              },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </Button>
      </div>
      <div className="pt-7">
        <Table data={cuisines} tableName="cuisine" />
      </div>
    </div>
  )
}

export default Cuisines
