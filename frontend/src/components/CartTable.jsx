import React, { useContext } from "react"

import { Button } from "@cmp"
import { StoreContext } from "@context"
import { MinusIcon, PlusDarkIcon, TrashIcon } from "@icons"
import PropTypes from "prop-types"

import { TableCell, TableHead, TableRow } from "./Table"

const CartTable = ({
  cartItems,
  dishes,
  addToCart,
  deleteFromCart,
  removeFromCart,
}) => {
  const { url } = useContext(StoreContext)
  return (
    <div className="relative w-full overflow-x-auto p-4">
      <h2 className="mb-4 text-lg font-bold">My Cart</h2>
      {cartItems && Object.keys(cartItems).length > 0 ? (
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <TableRow className="border-b">
              <TableHead>Menu Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </thead>
          <tbody>
            {dishes.map((dish) =>
              cartItems[dish._id] > 0 ? (
                <TableRow key={dish._id} className="border-b">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={url + "/images/" + dish.image}
                        alt={dish.name}
                        className="h-8 w-8 rounded object-cover"
                      />
                      {dish.name}
                    </div>
                  </TableCell>
                  <TableCell>${dish.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex gap-2 rounded border">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(dish._id)}
                        >
                          <img
                            src={MinusIcon}
                            alt="Minus Icon"
                            className="h-3 w-3"
                          />
                        </Button>
                        {cartItems[dish._id]}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => addToCart(dish._id)}
                        >
                          <img
                            src={PlusDarkIcon}
                            alt="Plus Icon"
                            className="h-3 w-3"
                          />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${cartItems[dish._id] * dish.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() => deleteFromCart(dish._id)}
                      className="cursor-pointer"
                    >
                      <img
                        src={TrashIcon}
                        alt="Trash Icon"
                        className="h-5 w-5"
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ) : null
            )}
          </tbody>
        </table>
      ) : (
        <p>No items in your cart</p>
      )}
    </div>
  )
}

CartTable.propTypes = {
  cartItems: PropTypes.object.isRequired,
  dishes: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  addToCart: PropTypes.func.isRequired,
  deleteFromCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
}

export default CartTable
