import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, Table } from "@cmp"
import { PlusIcon } from "@icons"
import { useToast } from "@providers"
import axios from "axios"

import { backendURL } from "@/constants"

const Orders = () => {
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const { addToast } = useToast()

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendURL}/admin/orders/`, {
        headers: {
          token: import.meta.env.VITE_ADMIN_TOKEN,
        },
      })
      const cleanedOrdersData = await Promise.all(
        response.data.data.map(async (order) => {
          const name = order.user?.name || "Unknown User"
          // eslint-disable-next-line no-unused-vars
          const { __v, address, user, ...rest } = order
          return { name, ...rest }
        })
      )
      setList(cleanedOrdersData)
    } catch (err) {
      console.error("Error in listing orders:", err)
      addToast("error", "Error", "Error in listing order")
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className="py-10">
      <div className="flex items-center justify-between">
        <h2>Orders</h2>
        <Button
          size="sm"
          variant="success"
          onClick={() => navigate("/orders/add_form")}
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </Button>
      </div>
      <div className="pt-7">
        <Table data={list} tableName="orders" />
      </div>
    </div>
  )
}

export default Orders
