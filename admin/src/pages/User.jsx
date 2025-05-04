import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { UserIcon } from "@icons"
import { useToast } from "@providers"
import axios from "axios"

import { Table } from "@/components"
import { backendImgURL, backendURL } from "@/constants"

const User = () => {
  const { userID } = useParams()
  const [orders, setOrders] = useState({})
  const [user, setUser] = useState({})
  const [shippingAddress, setShippingAddress] = useState({})
  const [billingAddress, setBillingAddress] = useState({})
  const { addToast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backendURL}/user/${userID}`, {
          headers: {
            token: import.meta.env.VITE_ADMIN_TOKEN,
          },
        })
        setUser(res.data.user)
        console.log(res.data.user.shippingAddress)
        setShippingAddress(res.data.user.shippingAddress)
        setBillingAddress(res.data.user.billingAddress)
        const ordersRes = await axios.get(
          `${backendURL}/order/user/${userID}`,
          {
            headers: {
              token: import.meta.env.VITE_ADMIN_TOKEN,
            },
          }
        )
        const cleanedOrdersData = await Promise.all(
          ordersRes.data.data.map(async (order) => {
            const updatedItems = await Promise.all(
              order.items.map(async (item) => {
                const itemRes = await axios.get(
                  `${backendURL}/dish/${item._id}`
                )
                return {
                  ...item,
                  image: itemRes.data.data.image,
                  name: itemRes.data.data.name,
                }
              })
            )
            const {
              /* eslint-disable no-unused-vars */
              __v,
              address,
              items,
              name,
              userID,
              /* eslint-enable no-unused-vars */
              date,
              amount,
              deliveryType,
              ...rest
            } = order
            return { date, items: updatedItems, amount, deliveryType, ...rest }
          })
        )
        setOrders(cleanedOrdersData)
      } catch (err) {
        addToast("error", "Error", `Error in retrieving: ${err}`)
      }
    }

    fetchData()
  }, [userID])

  return (
    <div className="flex flex-col gap-7">
      <h2>User</h2>
      <div className="flex justify-between">
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
        <div className="flex justify-between">
          <div className="pr-35 flex flex-col">
            <h4>Shipping Address</h4>
            {shippingAddress &&
            Object.values(shippingAddress).some((value) => value) ? (
              <>
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
              </>
            ) : (
              <>-</>
            )}
          </div>
          <div className="pr-35 flex flex-col">
            <h4>Billing Address</h4>
            {billingAddress &&
            Object.values(billingAddress).some((value) => value) ? (
              <>
                <p className="m-0">
                  {billingAddress.firstName}
                  {billingAddress.lastName}
                </p>
                <p className="m-0">{billingAddress.email}</p>
                <p className="m-0">{billingAddress.phone}</p>
                <p className="m-0">
                  {billingAddress.street}, {billingAddress.city},
                </p>
                <p className="m-0">
                  {billingAddress.state}, {billingAddress.zipcode},{" "}
                  {billingAddress.country}
                </p>
              </>
            ) : (
              <>-</>
            )}
          </div>
        </div>
      </div>
      {orders.length > 0 && (
        <div>
          <h4 className="mb-2">Orders</h4>
          <Table data={orders} tableName="order" />
        </div>
      )}
    </div>
  )
}

export default User
