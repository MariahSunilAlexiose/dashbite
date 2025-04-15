import React, { useContext, useEffect, useState } from "react"

import { OrderTable } from "@cmp"
import { StoreContext } from "@context"
import axios from "axios"

const MyOrders = () => {
  const { url, token } = useContext(StoreContext)

  const [orders, setOrders] = useState([])
  const fetchOrders = async () => {
    const response = await axios.get(url + "/api/order/myOrders", {
      headers: { token },
    })
    setOrders(response.data.data)
  }
  useEffect(() => {
    if (token) {
      fetchOrders()
    }
  }, [token])
  return (
    <div className="flex flex-col items-center py-10">
      <h3>My Order History</h3>
      <OrderTable orders={orders} />
    </div>
  )
}

export default MyOrders
