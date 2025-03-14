import React, { useContext, useState } from "react"

import { Button, Input, RadioInput, Table } from "@cmp"
import { StoreContext } from "@context"
import { TicketIcon } from "@icons"

import { shippingOptions } from "@/constants"

const Cart = () => {
  const {
    cartItems,
    store,
    addToCart,
    deleteFromCart,
    removeFromCart,
    getTotalCartAmt,
  } = useContext(StoreContext)
  const [selectedValue, setSelectedValue] = useState("free_shipping")

  const totalCartAmt = getTotalCartAmt()
  let adjustedTotal = totalCartAmt

  if (selectedValue === "express_shipping") {
    adjustedTotal += 15
  } else if (selectedValue === "pick_up") {
    adjustedTotal -= totalCartAmt * 0.05
  }

  return (
    <div className="flex flex-col gap-6 pt-10 md:flex-row">
      <Table
        cartItems={cartItems}
        store={store}
        addToCart={addToCart}
        deleteFromCart={deleteFromCart}
        removeFromCart={removeFromCart}
      />
      {Object.keys(cartItems).length > 0 && (
        <div className="flex flex-col gap-10">
          {/* Coupon code */}
          <div>
            <div>
              <h4>Have a coupon?</h4>
              <p className="text-muted m-0">
                Add your code for an instant cart discount
              </p>
            </div>
            <div className="relative flex items-center pt-3">
              <Input
                type="text"
                placeholder="Coupon Code"
                icon={TicketIcon}
                iconName="Ticket Icon"
              />
            </div>
          </div>
          {/* Cart summary */}
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
                className="bg-foreground hover:bg-blue-80 text-background hover:text-background! dark:hover:bg-blue-30 w-full"
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
