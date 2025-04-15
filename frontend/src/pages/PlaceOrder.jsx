import React, { useState } from "react"
import { useLocation } from "react-router-dom"

import { CartSummary, Input } from "@cmp"

const PlaceOrder = () => {
  const location = useLocation()
  const { selectedValue } = location.state || {}
  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  })

  const onChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value
    setDeliveryInfo((deliveryInfo) => ({ ...deliveryInfo, [name]: value }))
  }

  return (
    <div className="flex justify-between gap-2">
      <div className="w-2/3 p-6">
        <h3>Delivery Information</h3>
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex gap-4">
            <Input
              type="name"
              placeholder="First Name"
              name="firstName"
              onChange={onChangeHandler}
              value={deliveryInfo.firstName}
            />
            <Input
              type="name"
              placeholder="Last Name"
              name="lastName"
              onChange={onChangeHandler}
              value={deliveryInfo.lastName}
            />
          </div>
          <Input
            type="email"
            placeholder="Email"
            name="email"
            onChange={onChangeHandler}
            value={deliveryInfo.email}
          />
          <Input
            type="text"
            placeholder="Street"
            name="street"
            onChange={onChangeHandler}
            value={deliveryInfo.street}
          />
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="City"
              name="city"
              onChange={onChangeHandler}
              value={deliveryInfo.city}
            />
            <Input
              type="text"
              placeholder="State"
              name="state"
              onChange={onChangeHandler}
              value={deliveryInfo.state}
            />
          </div>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Zip Code"
              name="zipcode"
              onChange={onChangeHandler}
              value={deliveryInfo.zipcode}
            />
            <Input
              type="text"
              placeholder="Country"
              name="country"
              onChange={onChangeHandler}
              value={deliveryInfo.country}
            />
          </div>
          <Input
            type="phone"
            placeholder="Phone"
            name="phone"
            onChange={onChangeHandler}
            value={deliveryInfo.phone}
          />
        </div>
      </div>
      <div className="w-1/3">
        <CartSummary
          deliveryValue={selectedValue}
          deliveryInfo={deliveryInfo}
        />
      </div>
    </div>
  )
}

export default PlaceOrder
