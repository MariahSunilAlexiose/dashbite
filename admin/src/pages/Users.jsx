import React, { useEffect, useState } from "react"

import { Table } from "@cmp"
import { useToast } from "@providers"
import axios from "axios"

import { backendURL } from "@/constants"

const Users = () => {
  const [list, setList] = useState([])
  const { addToast } = useToast()

  const fetchList = async () => {
    try {
      const res = await axios.get(`${backendURL}/user/all`, {
        headers: {
          token: import.meta.env.VITE_ADMIN_TOKEN,
        },
      })
      const cleanedUsersData = res.data.data.map((item) => {
        const {
          __v, // eslint-disable-line no-unused-vars
          shippingAddress,
          billingAddress,
          password, // eslint-disable-line no-unused-vars
          cartData, // eslint-disable-line no-unused-vars
          profilePic,
          ...rest
        } = item
        const newShippingAddress = `${shippingAddress.name}, ${shippingAddress.phone}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zip}, ${shippingAddress.country}`
        const newBillingAddress = `${billingAddress.name}, ${billingAddress.phone}, ${billingAddress.street}, ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.zip}, ${billingAddress.country}`
        return {
          profilePic,
          ...rest,
          shippingAddress:
            Object.keys(shippingAddress).length > 0 &&
            Object.values(shippingAddress).every((value) => value != "")
              ? newShippingAddress
              : "",
          billingAddress:
            Object.keys(billingAddress).length > 0 &&
            Object.values(billingAddress).every((value) => value != "")
              ? newBillingAddress
              : "",
        }
      })
      setList(cleanedUsersData)
    } catch (err) {
      console.error(err)
      addToast("error", "Error", `Error in listing user: ${err}`)
    }
  }

  useEffect(() => {
    fetchList()
  })

  return (
    <div className="py-10">
      <h2>Users</h2>
      <div className="pt-7">
        <Table data={list} tableName="user" />
      </div>
    </div>
  )
}

export default Users
