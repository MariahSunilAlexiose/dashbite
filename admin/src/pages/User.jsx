import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { ThemeContext } from "@context"
import { UserIcon, UserWhiteIcon } from "@icons"
import { useToast } from "@providers"

import { Table } from "@/components"
import { backendImgURL, fetchEndpoint } from "@/constants"

const User = () => {
  const { userID } = useParams()
  const { addToast } = useToast()
  const { theme } = useContext(ThemeContext)

  const [orders, setOrders] = useState({})
  const [user, setUser] = useState({})
  const [shippingAddress, setShippingAddress] = useState({})
  const [billingAddress, setBillingAddress] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get user
        const userData = await fetchEndpoint(`user/${userID}`, {
          token: import.meta.env.VITE_ADMIN_TOKEN,
        })
        setUser(userData)
        setShippingAddress(userData.shippingAddress)
        setBillingAddress(userData.billingAddress)

        // get user orders
        const ordersData = await fetchEndpoint(`order/user/${userID}`, {
          token: import.meta.env.VITE_ADMIN_TOKEN,
        })
        const cleanedOrdersData = await Promise.all(
          ordersData.map(async (order) => {
            const updatedItems = await Promise.all(
              order.items.map(async (item) => {
                const dishData = await fetchEndpoint(`dish/${item._id}`)
                return {
                  ...item,
                  image: dishData.image,
                  name: dishData.name,
                }
              })
            )
            const {
              /* eslint-disable no-unused-vars */
              address,
              items,
              name,
              userID,
              /* eslint-enable no-unused-vars */
              amount,
              deliveryType,
              ...rest
            } = order
            return { items: updatedItems, amount, deliveryType, ...rest }
          })
        )
        setOrders(cleanedOrdersData)
      } catch (err) {
        console.error("Error fetching user:", err)
        addToast("error", "Error", "Failed to fetch user!")
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
