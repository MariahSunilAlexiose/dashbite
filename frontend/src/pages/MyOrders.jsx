import React, { useContext, useEffect, useState } from "react"

import { AccountCard, OrderTable } from "@cmp"
import { StoreContext } from "@context"

import { fetchEndpoint } from "@/constants"

const MyOrders = () => {
  const { url, token } = useContext(StoreContext)

  const [orders, setOrders] = useState([])

  const fetchOrders = async () => {
    // get orders
    const ordersData = await fetchEndpoint(url, "order/myorders", { token })

    // Map over ordersData first
    const enrichedOrders = await Promise.all(
      ordersData.map(async (order) => {
        const enrichedItems = await Promise.all(
          order.items.map(async (dish) => {
            const dishData = await fetchEndpoint(url, `dish/${dish._id}`)
            return { ...dish, dishData } // Add dish data to each item
          })
        )
        return { ...order, items: enrichedItems } // Attach enriched items to the order
      })
    )

    setOrders(enrichedOrders)
  }

  useEffect(() => {
    fetchOrders()
  }, [token])

  return (
    <div>
      <h2 className="text-center">My Account</h2>
      <div className="flex-center flex gap-10 py-10">
        <div className="w-1/6">
          <AccountCard />
        </div>
        <div className="w-full">
          <h4>My Order History</h4>
          <OrderTable orders={orders} />
        </div>
      </div>
    </div>
  )
}

export default MyOrders
