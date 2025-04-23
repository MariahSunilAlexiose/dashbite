import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { PencilIcon, UserIcon } from "@icons"
import axios from "axios"

import { Button, Table } from "@/components"
import { backendImgURL, backendURL, formatDate } from "@/constants"

const Order = () => {
  const navigate = useNavigate()
  const { orderID } = useParams()
  const [order, setOrder] = useState({})
  const [user, setUser] = useState({})
  const [shippingAddress, setShippingAddress] = useState({})
  const [items, setItems] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backendURL}/admin/orders/${orderID}`, {
          headers: {
            token: import.meta.env.VITE_ADMIN_TOKEN,
          },
        })

        setOrder(res.data.data)
        console.log(res.data.data)
        setUser(res.data.data.user)

        const items = await Promise.all(
          res.data.data.items.map((item) => {
            const {
              /* eslint-disable no-unused-vars */
              __v,
              image,
              name,
              description,
              price,
              category,
              rating,
              /* eslint-enable no-unused-vars */
              quantity,
            } = item
            return {
              image,
              name,
              price,
              quantity,
            }
          })
        )
        setItems(items)
        setShippingAddress(res.data.data.address)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [orderID])

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h2>Order</h2>
        <Button size="sm" onClick={() => navigate("/orders/edit_form")}>
          <img src={PencilIcon} alt="Pencil Icon" className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex justify-between">
        {/* User */}
        <div className="flex gap-2">
          <div className="h-15 w-15 relative flex shrink-0 items-center justify-center overflow-hidden rounded-full">
            <img
              src={
                user.profilePic &&
                user.profilePic.startsWith("https://ui-avatars.com/api/?name=")
                  ? user.profilePic
                  : `${backendImgURL}/${user.profilePic || UserIcon}`
              }
              alt="User Profile"
              className="aspect-square h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="m-0">{user.name}</p>
            <p className="m-0">{user.email}</p>
          </div>
        </div>
        {/* Shipping Address */}
        <div className="pr-45 flex flex-col">
          <h4>Shipping Address</h4>
          <p className="m-0">
            {shippingAddress.firstName}
            {shippingAddress.lastName}
          </p>
          <p className="m-0">{shippingAddress.email}</p>
          <p className="m-0">{shippingAddress.phone}</p>
          <p className="m-0">
            {shippingAddress.street},{shippingAddress.city},
            {shippingAddress.state},{shippingAddress.zipcode},
            {shippingAddress.country}
          </p>
        </div>
      </div>
      {/* Order Details */}
      <div>
        <h4 className="mb-2">Order Details</h4>
        <div className="flex justify-between">
          <div>
            <p>Order ID: {orderID}</p>
            <p className="m-0">Amount: ${order.amount}</p>
            {order.date && (
              <p className="m-0">Date: {formatDate(order.date)}</p>
            )}
          </div>
          <div className="pr-30 flex flex-col">
            <p className="m-0">
              Delivery Type:{" "}
              {order.deliveryType === "free_shipping"
                ? "Free shipping"
                : order.deliveryType === "express_shipping"
                  ? "Express Shipping"
                  : "Pick up"}
            </p>
            <p className="m-0">
              Payment Status: {order.payment ? "Paid" : "Not Paid"}
            </p>
            <p className="m-0">Status: {order.status}</p>
          </div>
        </div>
      </div>
      {/* Items */}
      <div>
        <Table data={items} tableName="orderitems" />
      </div>
    </div>
  )
}

export default Order
