import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { PencilIcon, UserIcon, UserWhiteIcon } from "@icons"
import { useTheme, useToast } from "@providers"

import { Button, Table } from "@/components"
import { backendImgURL, fetchEndpoint, formatDate } from "@/constants"

const Order = () => {
  const navigate = useNavigate()
  const { orderID } = useParams()
  const { theme } = useTheme()

  const [order, setOrder] = useState({})
  const [user, setUser] = useState({})
  const [shippingAddress, setShippingAddress] = useState({})
  const [items, setItems] = useState([])
  const { addToast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get order
        const orderData = await fetchEndpoint(`order/${orderID}`, {
          token: import.meta.env.VITE_ADMIN_TOKEN,
        })
        setOrder(orderData)
        setShippingAddress(orderData.address)

        // get user
        const userData = await fetchEndpoint(`user/${orderData.userID}`, {
          token: import.meta.env.VITE_ADMIN_TOKEN,
        })
        setUser(userData)

        // get order items
        const updatedItems = await Promise.all(
          orderData.items.map(async (item) => {
            const dishData = await fetchEndpoint(`dish/${item._id}`)
            const { __v, description, category, rating, ...filteredItem } = item // eslint-disable-line no-unused-vars
            return {
              image: dishData.image,
              name: dishData.name,
              price: dishData.price,
              restaurantName: (
                await fetchEndpoint(`restaurant/${dishData.restaurantID}`)
              ).name,
              ...filteredItem,
              subtotal: dishData.price * item.quantity,
            }
          })
        )
        setItems(updatedItems)
      } catch (err) {
        console.error("Error fetching order:", err)
        addToast("error", "Error", "Failed to fetch order!")
      }
    }

    fetchData()
  }, [orderID])

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <h2>Order</h2>
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            navigate("/update_form", {
              state: {
                tableName: "order",
                dataToBeUpdated: {
                  _id: order._id,
                  userID: order.userID,
                  date: order.createdAt,
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
                user?.profilePic
                  ? user.profilePic.startsWith(
                      "https://ui-avatars.com/api/?name="
                    )
                    ? user.profilePic
                    : `${backendImgURL}/${user.profilePic}`
                  : theme === "dark"
                    ? UserWhiteIcon
                    : UserIcon
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
          {order.createdAt && (
            <p className="m-0">Date: {formatDate(order.createdAt)}</p>
          )}
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
