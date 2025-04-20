import React, { useContext, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { Button } from "@cmp"
import { StoreContext } from "@context"
import { useToast } from "@providers"
import axios from "axios"

import { formatDate } from "@/constants"

const Verify = () => {
  const [searchParams] = useSearchParams()
  const [order, setOrder] = useState({})
  const [loading, setLoading] = useState(true)
  const success = searchParams.get("success")
  const orderID = searchParams.get("orderID")
  const { url, token } = useContext(StoreContext)
  const navigate = useNavigate()

  const verifyPayment = async () => {
    const { addToast } = useToast()
    try {
      const verifyRes = await axios.post(
        url + "/api/order/verify",
        { success, orderID },
        { headers: { token } }
      )
      if (!verifyRes.data.success) {
        addToast("error", "Error", verifyRes.data.message)
        return
      }
      if (verifyRes.status === 200) {
        const orderRes = await axios.get(url + "/api/order/" + orderID, {
          headers: { token },
        })
        if (!orderRes.data.success) {
          addToast("error", "Error", orderRes.data.message)
          return
        }
        setOrder(orderRes.data)
      } else {
        console.error("Payment verification failed")
      }
    } catch (error) {
      console.error("Failed to fetch order:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (success && orderID) {
      verifyPayment()
    }
  }, [orderID, success])

  useEffect(() => {
    if (
      order &&
      (order.success === false || order.message === "Not Authorized Login!")
    ) {
      setLoading(true)
      verifyPayment()
    }
  }, [order])

  console.log(order)

  return (
    <div className="flex items-center justify-center">
      {loading ? (
        <div className="text-center">
          <p>Loading...</p>
          <div className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4"></div>
        </div>
      ) : (
        <div className="relative m-6 flex flex-col space-y-8 rounded-2xl shadow-2xl md:flex-row md:space-y-0">
          {order && Object.keys(order).length > 0 && (
            <div className="bg-accent flex flex-col items-center justify-center gap-4 rounded-l-2xl p-8 md:p-14">
              <h4 className="text-blue-40">Thank you!</h4>
              <h2>Your order has been received</h2>
              <div className="flex gap-3">
                {order.items &&
                  order.items.map((item, key) => (
                    <div key={key} className="w-26 relative h-32">
                      <img
                        src={url + "/images/" + item.image}
                        alt={item.name}
                        className="h-full w-full rounded-xl"
                      />
                      <div className="bg-foreground text-background absolute -right-2 -top-2 rounded-full px-2.5 py-1 text-xs font-bold shadow-md">
                        {item.quantity}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex gap-7">
                <div className="text-gray-10 flex flex-col text-left">
                  <p>Order ID:</p>
                  <p>Date:</p>
                  <p>Total:</p>
                  <p>Delivery Type:</p>
                  <p>Status:</p>
                </div>
                <div className="flex flex-col text-left">
                  <p>{order._id}</p>
                  <p>{formatDate(order.date || new Date().toISOString())}</p>
                  <p>CAD {order.amount}</p>
                  <p>
                    {order.deliveryType === "free_shipping"
                      ? "Free Shipping"
                      : order.deliveryType === "express_shipping"
                        ? "Express Shipping"
                        : "Pick Up"}
                  </p>
                  <p>{order.status}</p>
                </div>
              </div>
              <div className="mt-5">
                <Button
                  size="lg"
                  className="bg-foreground! rounded-full!"
                  onClick={() => navigate("/myorders")}
                >
                  Purchase History
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Verify
