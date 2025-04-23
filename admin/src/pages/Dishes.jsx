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
      const response = await axios.get(`${backendURL}/dish/`)
      const cleanedDishesData = response.data.data.map((item) => {
        const { __v, image, ...rest } = item // eslint-disable-line no-unused-vars
        return { image, ...rest }
      })
      setList(cleanedDishesData)
    } catch (err) {
      console.error("Error in listing dishes:", err)
      addToast("error", "Error", "Error in listing dish")
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
          onClick={() => navigate("/dishes/add_form")}
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </Button>
      </div>
      <div className="pt-7">
        <Table data={list} tableName="dishes" />
      </div>
    </div>
  )
}

export default Dishes
