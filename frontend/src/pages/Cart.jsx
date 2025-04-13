import React, { useContext } from "react"

import { CartSummary, Input, Table } from "@cmp"
import { StoreContext } from "@context"
import { TicketIcon } from "@icons"

const Cart = () => {
  const { cartItems, dishes, addToCart, deleteFromCart, removeFromCart } =
    useContext(StoreContext)

  return (
    <div className="flex flex-col gap-6 pt-10 md:flex-row">
      <Table
        cartItems={cartItems}
        dishes={dishes}
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
          <CartSummary />
        </div>
      )}
    </div>
  )
}

export default Cart
