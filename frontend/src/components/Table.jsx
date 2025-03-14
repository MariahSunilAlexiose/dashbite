import React from "react"

import { Button } from "@cmp"
import { MinusIcon, PlusDarkIcon, TrashIcon } from "@icons"
import PropTypes from "prop-types"

const TableRow = ({ children, className }) => {
  return (
    <tr className={`${className} border-b transition-colors`}>{children}</tr>
  )
}

const TableHead = ({ children, className }) => {
  return (
    <th className={`${className} text-muted h-10 p-2 text-center`}>
      {children}
    </th>
  )
}

const TableCell = ({ children, className }) => {
  return <td className={`${className} p-2 text-center`}>{children}</td>
}

TableRow.propTypes =
  TableHead.propTypes =
  TableCell.propTypes =
    {
      children: PropTypes.node.isRequired,
      className: PropTypes.string,
    }

const Table = ({
  cartItems,
  store,
  addToCart,
  deleteFromCart,
  removeFromCart,
}) => {
  return (
    <div className="relative w-full overflow-x-auto p-4">
      <h2 className="mb-4 text-lg font-bold">My Cart</h2>
      {Object.keys(cartItems).length > 0 ? (
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
            {store.dishes.map((dish) =>
              cartItems[dish._id] > 0 ? (
                <TableRow key={dish._id} className="border-b">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={dish.image}
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
                    <button onClick={() => deleteFromCart(dish._id)}>
                      <img
                        src={TrashIcon}
                        alt="Trash Icon"
                        className="h-5 w-5"
                      />
                    </button>
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

Table.propTypes = {
  cartItems: PropTypes.object.isRequired,
  store: PropTypes.shape({
    dishes: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
  deleteFromCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
}

export default Table
