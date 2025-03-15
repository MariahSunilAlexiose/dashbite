import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, RadioInput } from "@cmp"
import { StoreContext } from "@context"
import PropTypes from "prop-types"

import { shippingOptions } from "@/constants"

const CartSummary = ({ deliveryValue }) => {
  const { getTotalCartAmt } = useContext(StoreContext)
  const navigate = useNavigate()

  const [selectedValue, setSelectedValue] = useState(
    deliveryValue || "free_shipping"
  )

  const totalCartAmt = getTotalCartAmt()
  let adjustedTotal = totalCartAmt

  if (selectedValue === "express_shipping") {
    adjustedTotal += 15
  } else if (selectedValue === "pick_up") {
    adjustedTotal -= totalCartAmt * 0.05
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
              selectedValue === option.value && "border-primary"
            }`}
            onClick={() => setSelectedValue(option.value)}
          >
            <RadioInput
              title={option.title}
              value={option.value}
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
          onClick={() => navigate("/order", { state: { selectedValue } })}
          className="bg-foreground hover:bg-blue-80 text-background hover:text-background! dark:hover:bg-blue-30 w-full"
        >
          {deliveryValue ? "Proceed to Payment" : "Checkout"}
        </Button>
      </div>
    </div>
  )
}

CartSummary.propTypes = {
  deliveryValue: PropTypes.string,
}

export default CartSummary
