import React, { useContext, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { StoreContext } from "@context"
import axios from "axios"

const Verify = () => {
  const [searchParams] = useSearchParams()
  const success = searchParams.get("success")
  const orderID = searchParams.get("orderID")
  const { url } = useContext(StoreContext)
  const navigate = useNavigate()
  const verifyPayment = async () => {
    const response = await axios.post(url + "/api/order/verify", {
      success,
      orderID,
    })
    if (response.data.success) {
      navigate("/myorders")
    } else {
      navigate("/")
    }
  }
  useEffect(() => {
    verifyPayment()
  }, [])
  return <div className="verify">Verify</div>
}

export default Verify
