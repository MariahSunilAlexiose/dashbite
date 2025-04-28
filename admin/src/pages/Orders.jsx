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
      const ordersRes = await axios.get(`${backendURL}/order`, {
        headers: {
          token: import.meta.env.VITE_ADMIN_TOKEN,
        },
      })
      const cleanedOrdersData = await Promise.all(
        ordersRes.data.data.map(async (order) => {
          const userRes = await axios.get(
            `${backendURL}/user/${order.userID}`,
            {
              headers: {
                token: import.meta.env.VITE_ADMIN_TOKEN,
              },
            }
          )
          const name = userRes.data.user.name || "Unknown User"
          const updatedItems = await Promise.all(
            order.items.map(async (item) => {
              const itemRes = await axios.get(`${backendURL}/dish/${item._id}`)
              return {
                ...item,
                image: itemRes.data.data.image,
                name: itemRes.data.data.name,
              }
            })
          )
          const { __v, address, items, userID, ...rest } = order // eslint-disable-line no-unused-vars
          return { name, items: updatedItems, ...rest }
        })
      )
      setList(cleanedOrdersData)
    } catch (err) {
      console.error(err)
      addToast("error", "Error", `Error in listing orders: ${err}`)
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
          onClick={() =>
            navigate("/add_form", {
              state: {
                tableName: "order",
                toBeAddedKeys: [
                  "userID",
                  "items",
                  "address",
                  "status",
                  "payment",
                  "deliveryType",
                ],
              },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </Button>
      </div>
      <div className="pt-7">
        <Table data={list} tableName="order" />
      </div>
    </div>
  )
}

export default Orders
