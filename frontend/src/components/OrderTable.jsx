import React, { useContext } from "react"

import { StoreContext } from "@context"
import PropTypes from "prop-types"

import { formatDate } from "@/constants"

import { TableCell, TableHead, TableRow } from "./Table"

const OrderTable = ({ orders }) => {
  const { url } = useContext(StoreContext)
  return (
    <div className="pt-5">
      {orders?.length > 0 ? (
        <div className="relative w-full overflow-x-auto p-4">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <TableRow className="border-b">
                <TableHead>Date</TableHead>
                <TableHead>OrderID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </thead>
            <tbody>
              {orders.map((order) => (
                <TableRow key={order._id} className="border-b">
                  <TableCell>{formatDate(order.updatedAt)}</TableCell>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      {order.items &&
                        order.items.map((item) => (
                          <div key={item._id} className="relative h-8 w-8">
                            <img
                              src={url + "/images/" + item.dishData.image}
                              alt={item.dishData.name}
                              className="h-full w-full rounded"
                            />
                            <div className="bg-foreground text-background absolute -right-2 -top-2 rounded-full px-2.5 py-1 text-xs font-bold shadow-md">
                              {item.quantity}
                            </div>
                          </div>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>${order.amount}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>You have no orders yet</p>
      )}
    </div>
  )
}

OrderTable.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      items: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        image: PropTypes.string,
        category: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
      }),
      date: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
}

export default OrderTable
