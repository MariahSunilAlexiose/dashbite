import React from "react"
import { useLocation } from "react-router-dom"

import { CartSummary, Input } from "@cmp"

const PlaceOrder = () => {
  const location = useLocation()
  const { selectedValue } = location.state || {}
  return (
    <div className="flex justify-between gap-2">
      <div className="w-2/3 p-6">
        <h3>Delivery Information</h3>
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex gap-4">
            <Input type="name" placeholder="First Name" />
            <Input type="name" placeholder="Last Name" />
          </div>
          <Input type="email" placeholder="Email" />
          <Input type="text" placeholder="Street" />
          <div className="flex gap-4">
            <Input type="name" placeholder="City" />
            <Input type="name" placeholder="State" />
          </div>
          <div className="flex gap-4">
            <Input type="name" placeholder="Zip Code" />
            <Input type="name" placeholder="Country" />
          </div>
          <Input type="phone" placeholder="Phone" />
        </div>
      </div>
      <div className="w-1/3">
        <CartSummary deliveryValue={selectedValue} />
      </div>
    </div>
  )
}

export default PlaceOrder
