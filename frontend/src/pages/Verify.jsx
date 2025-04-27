import React, { useContext, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { Button } from "@cmp"
import { StoreContext } from "@context"
import { useToast } from "@providers"
import axios from "axios"

const Verify = () => {
  const [searchParams] = useSearchParams()
  const success = searchParams.get("success")
  const orderID = searchParams.get("orderID")
  const { url, token } = useContext(StoreContext)
  const { addToast } = useToast()
  const navigate = useNavigate()

  const verifyPayment = async () => {
    try {
      const res = await axios.post(
        url + "/api/order/verify",
        { success, orderID },
        { headers: { token } }
      )
      if (res.data.success) {
        navigate("/myorders")
        setTimeout(() => {
          window.location.reload()
        }, 100)
      } else {
        addToast("error", "Error", `Error: ${res.data.message}`)
        return
      }
    } catch (err) {
      addToast("error", "Error", `Error in retrieving order: ${err}`)
    }
  }

  useEffect(() => {
    if (success && orderID) {
      verifyPayment()
    }
  }, [orderID, success])

  return (
    <div className="shadow-blue-30 dark:shadow-accent relative m-6 flex flex-col items-center space-y-8 rounded-2xl p-10 shadow-2xl">
      <h4 className="text-red-500">Payment Failed</h4>
      <h2>We were unable to process your payment</h2>
      <p className="text-center text-gray-500">
        Unfortunately, the payment was unsuccessful. Please check your payment
        details and try again.
      </p>
      <div className="mt-5">
        <Button size="lg" onClick={() => navigate("/cart")}>
          Try Again
        </Button>
      </div>
    </div>
  )
}

export default Verify
