import React, { useEffect, useState } from "react"

import { Table } from "@cmp"
import { useToast } from "@providers"

import { fetchEndpoint } from "@/constants"

const Users = () => {
  const [users, setUsers] = useState([])
  const { addToast } = useToast()

  const fetchData = async () => {
    try {
      const usersData = await fetchEndpoint("user", {
        token: import.meta.env.VITE_ADMIN_TOKEN,
      })
      const cleanedUsersData = usersData.map((item) => {
        const {
          /* eslint-disable no-unused-vars */
          password,
          cartData,
          /* eslint-enable no-unused-vars */
          shippingAddress,
          billingAddress,
          profilePic,
          ...rest
        } = item
        return {
          profilePic,
          ...rest,
          shippingAddress:
            Object.keys(shippingAddress).length > 0 &&
            Object.values(shippingAddress).every((value) => value != "")
              ? `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zip}, ${shippingAddress.country}`
              : "",
          billingAddress:
            Object.keys(billingAddress).length > 0 &&
            Object.values(billingAddress).every((value) => value != "")
              ? `${billingAddress.street}, ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.zip}, ${billingAddress.country}`
              : "",
        }
      })
      setUsers(cleanedUsersData)
    } catch (err) {
      console.error("Error fetching users:", err)
      addToast("error", "Error", "Failed to load users!")
    }
  }

  useEffect(() => {
    fetchData()
  })

  return (
    <div className="flex flex-col gap-5">
      <h2>Users</h2>
      <Table data={users} tableName="user" />
    </div>
  )
}

export default Users
