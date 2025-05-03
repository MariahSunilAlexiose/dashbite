import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, RadioInput } from "@cmp"
import { StoreContext } from "@context"
import { useToast } from "@providers"
import axios from "axios"
import PropTypes from "prop-types"

import { shippingOptions } from "@/constants"

const CartSummary = ({ deliveryValue, deliveryInfo }) => {
  const { getTotalCartAmt, dishes, cartItems, url, token } =
    useContext(StoreContext)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [selectedValue, setSelectedValue] = useState(
    deliveryValue || "Free Shipping"
  )

  const totalCartAmt = getTotalCartAmt()
  let adjustedTotal = totalCartAmt

  if (selectedValue === "Express Shipping") {
    adjustedTotal += 15
  } else if (selectedValue === "Pick Up") {
    adjustedTotal -= totalCartAmt * 0.05
  }

  const placeOrder = async (e) => {
    e.preventDefault()
    let orderItems = []
    dishes.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item
        itemInfo["quantity"] = cartItems[item._id]
        orderItems.push(itemInfo)
      }
    })
    let orderData = {
      address: deliveryInfo,
      items: orderItems,
      amount: adjustedTotal,
      deliveryType: selectedValue,
    }

    try {
      let res = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      })
      if (!res.data.success) {
        addToast("error", "Error", `Error: ${res.data.message}`)
        return
      }
      window.location.replace(res.data.session_url)
    } catch (err) {
      addToast("error", "Error", `Error in placing order: ${err}`)
    }
  }

  return (
    <div className="border-muted rounded-md border p-5">
      <h4>Cart summary</h4>
      <div className="flex justify-between p-2 text-sm">
        <p className="m-0">Subtotal</p>
        <p className="m-0">${totalCartAmt}</p>
      </div>
      {/* Delivery options */}
      <div className="flex flex-col gap-2 pt-3">
        {shippingOptions.map((option) => (
          <div
            key={option.value}
            className={`flex cursor-pointer justify-between rounded border p-2 ${
              selectedValue === option.title && "border-primary"
            }`}
            onClick={() => setSelectedValue(option.title)}
          >
            <RadioInput
              title={option.title}
              value={option.title}
              selectedValue={selectedValue}
              onValueChange={setSelectedValue}
            />
            <p className="m-0 text-sm">{option.cost}</p>
          </div>
        ))}
      </div>

      <div className="text-md flex justify-between p-2 font-bold">
        <p className="m-0">Total</p>
        <p className="m-0">${adjustedTotal}</p>
      </div>
      <div className="pt-3">
        <Button
          variant="ghost"
          className="bg-foreground hover:bg-blue-80 text-background hover:text-background! dark:hover:bg-blue-30 w-full"
          onClick={(e) => {
            if (deliveryValue) {
              placeOrder(e)
            } else {
              e.preventDefault()
              navigate("/order", { state: { selectedValue } })
            }
          }}
        >
          {deliveryValue ? "Proceed to Payment" : "Checkout"}
        </Button>
      </div>
    </div>
  )
}

CartSummary.propTypes = {
  deliveryValue: PropTypes.string,
  data: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zipcode: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    phone: PropTypes.number.isRequired,
  }).isRequired,
  deliveryInfo: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zipcode: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    phone: PropTypes.number.isRequired,
  }),
}

export default CartSummary
