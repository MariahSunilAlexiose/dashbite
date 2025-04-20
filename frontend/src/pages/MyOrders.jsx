import React, { useContext, useEffect, useState } from "react"

import { AccountCard, OrderTable } from "@cmp"
import { StoreContext } from "@context"
import { useToast } from "@providers"
import axios from "axios"

const MyOrders = () => {
  const { addToast } = useToast()
  const { url, token } = useContext(StoreContext)

  const [orders, setOrders] = useState([])
  const fetchOrders = async () => {
    const response = await axios.get(url + "/api/order/myOrders", {
      headers: { token },
    })
    if (!response.data.success) {
      addToast("error", "Error", response.data.message)
      return
    }
    setOrders(response.data.data)
  }
  useEffect(() => {
    if (token) {
      fetchOrders()
    }
  }, [token])
  return (
    <div>
      <h2 className="text-center">My Account</h2>
      <div className="flex-center flex gap-10 p-10">
        <div className="w-1/6">
          <AccountCard />
        </div>
        <div>
          <h4>My Order History</h4>
          <OrderTable orders={orders} />
        </div>
      </div>
    </div>
  )
}

export default MyOrders
