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
    const res = await axios.get(url + "/api/order/myOrders", {
      headers: { token },
    })
    if (!res.data.success) {
      addToast("error", "Error", `Error: ${res.data.message}`)
      return
    }
    setOrders(res.data.data)
  }
  useEffect(() => {
    if (token) {
      fetchOrders()
    }
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
