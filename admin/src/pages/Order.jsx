import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { PencilIcon, UserIcon } from "@icons"
import { useToast } from "@providers"
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
  const { addToast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backendURL}/order/${orderID}`, {
          headers: {
            token: import.meta.env.VITE_ADMIN_TOKEN,
          },
        })
        setOrder(res.data.data)
        setShippingAddress(res.data.data.address)

        const userRes = await axios.get(
          `${backendURL}/user/${res.data.data.userID}`,
          {
            headers: {
              token: import.meta.env.VITE_ADMIN_TOKEN,
            },
          }
        )
        setUser(userRes.data.user)

        const updatedItems = await Promise.all(
          res.data.data.items.map(async (item) => {
            const itemRes = await axios.get(`${backendURL}/dish/${item._id}`)
            const { __v, description, category, rating, ...filteredItem } = item // eslint-disable-line no-unused-vars

            return {
              image: itemRes.data.data.image,
              name: itemRes.data.data.name,
              price: itemRes.data.data.price,
              ...filteredItem,
              subtotal: itemRes.data.data.price * item.quantity,
            }
          })
        )
        setItems(updatedItems)
      } catch (err) {
        addToast("error", "Error", `Error in adding dish: ${err}`)
      }
    }

    fetchData()
  }, [orderID])

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h2>Order</h2>
        <Button
          size="sm"
          onClick={() =>
            navigate("/update_form", {
              state: {
                tableName: "order",
                dataToBeUpdated: {
                  _id: order._id,
                  userID: order.userID,
                  date: order.date,
                  payment: order.payment,
                  status: order.status,
                  address: order.address,
                  items: order.items,
                  deliveryType: order.deliveryType,
                },
              },
            })
          }
        >
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
        {shippingAddress && (
          <div className="pr-35 flex flex-col">
            <h4>Shipping Address</h4>
            <p className="m-0">
              {shippingAddress.firstName}
              {shippingAddress.lastName}
            </p>
            <p className="m-0">{shippingAddress.email}</p>
            <p className="m-0">{shippingAddress.phone}</p>
            <p className="m-0">
              {shippingAddress.street}, {shippingAddress.city},
            </p>
            <p className="m-0">
              {shippingAddress.state}, {shippingAddress.zipcode},{" "}
              {shippingAddress.country}
            </p>
          </div>
        )}
      </div>
      {/* Order Details */}
      <div>
        <h4 className="mb-2">Order Details</h4>
        <div className="flex justify-between">
          <p>Order ID: {orderID}</p>
          {order.date && <p className="m-0">Date: {formatDate(order.date)}</p>}
          <p className="m-0">Status: {order.status}</p>
        </div>
      </div>
      <div>
        <Table
          data={items}
          tableName="orderitem"
          extraData={{
            deliveryType: order.deliveryType,
            amount: order.amount,
          }}
          pageID={orderID}
        />
      </div>
    </div>
  )
}

export default Order
