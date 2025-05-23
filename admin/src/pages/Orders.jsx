import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, Table } from "@cmp"
import { PlusIcon } from "@icons"
import { useToast } from "@providers"

import { fetchEndpoint } from "@/constants"

const Orders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const { addToast } = useToast()

  const fetchData = async () => {
    try {
      // get orders
      const ordersData = await fetchEndpoint("order", {
        token: import.meta.env.VITE_ADMIN_TOKEN,
      })
      const cleanedOrdersData = await Promise.all(
        ordersData.map(async (order) => {
          const { address, items, userID, ...rest } = order // eslint-disable-line no-unused-vars

          const user = await fetchEndpoint(`user/${userID}`, {
            token: import.meta.env.VITE_ADMIN_TOKEN,
          })

          const username = user?.name || "Unknown User"

          return {
            username,
            items: await Promise.all(
              items.map(async (item) => {
                const dish = await fetchEndpoint(`dish/${item._id}`)
                return {
                  ...item,
                  image: dish?.image || "",
                  name: dish?.name || "Unknown",
                }
              })
            ),
            ...rest,
          }
        })
      )
      setOrders(cleanedOrdersData)
    } catch (err) {
      console.error(err)
      console.error("Error fetching orders:", err)
      addToast("error", "Error", "Failed to fetch orders!")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="py-10">
      <div className="flex items-center justify-between">
        <h2>Orders</h2>
        <Button
          variant="success"
          size="sm"
          onClick={() =>
            navigate("/add_form", {
              state: {
                tableName: "order",
                toBeAddedKeys: [
                  "user",
                  "address",
                  "items",
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
        <Table data={orders} tableName="order" />
      </div>
    </div>
  )
}

export default Orders
