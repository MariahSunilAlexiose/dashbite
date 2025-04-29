import React, { useContext, useEffect, useState } from "react"

import { AccountCard, AddressCard } from "@cmp"
import { StoreContext } from "@context"
import { useToast } from "@providers"
import axios from "axios"

import { fetchUser } from "@/constants"

const Address = () => {
  const [billingModalOpen, setBillingModalOpen] = useState(false)
  const [shippingModalOpen, setShippingModalOpen] = useState(false)
  const [toBeUpdatedBilling, setToBeUpdatedBilling] = useState(false)
  const [toBeUpdatedShipping, setToBeUpdatedShipping] = useState(false)
  const { addToast } = useToast()
  const [user, setUser] = useState({}) // eslint-disable-line no-unused-vars
  const { url, token, userID } = useContext(StoreContext)
  const [formData, setFormData] = useState({
    billingAddress: {},
    shippingAddress: {},
  })
  const handleSave = async (type) => {
    try {
      const method =
        (type === "billing" && toBeUpdatedBilling) ||
        (type !== "billing" && toBeUpdatedShipping)
          ? axios.put
          : axios.post

      await method(`${url}/api/user/address`, formData, {
        headers: { token },
      })
      window.location.reload()
      addToast("success", "Success", "Updated address successfully!")
    } catch (err) {
      addToast("error", "Error", `Error in saving addresses: ${err}`)
    }
  }
  const handleDelete = async (type) => {
    let updatedFormData
    if (type === "shippingAddress") {
      updatedFormData = {
        ...formData,
        shippingAddress: {}, // Empty the shippingAddress
      }
      setFormData(updatedFormData) // Update the state
    } else {
      updatedFormData = {
        ...formData,
        billingAddress: {}, // Empty the billingAddress
      }
      setFormData(updatedFormData) // Update the state
    }
    try {
      // Use the updatedFormData directly instead of formData
      await axios.put(`${url}/api/user/address`, updatedFormData, {
        headers: { token },
      })
      window.location.reload()
      addToast("success", "Success", "Deleted address successfully!")
    } catch (err) {
      addToast("error", "Error", `Error in saving addresses: ${err}`)
    }
  }
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedUser = await fetchUser({ url, token, addToast })
      if (fetchedUser) {
        setUser(fetchedUser)
        setFormData({
          billingAddress: fetchedUser.billingAddress || {},
          shippingAddress: fetchedUser.shippingAddress || {},
        })
        setToBeUpdatedBilling(!!fetchedUser.billingAddress)
        setToBeUpdatedShipping(!!fetchedUser.shippingAddress)
      }
    }
    fetchUserData()
  }, [token, userID])
  return (
    <div>
      <h2 className="text-center">My Account</h2>
      <div className="flex-center flex gap-10 p-10">
        <div className="w-1/6">
          <AccountCard />
        </div>
        <div className="w-full">
          <div className="flex justify-between">
            <h4 className="mb-5">My Address</h4>
          </div>
          <div className="flex gap-5">
            <div className="flex flex-grow basis-0 gap-5">
              <AddressCard
                title="Billing Address"
                addressData={formData.billingAddress}
                setModalOpen={setBillingModalOpen}
                modalOpen={billingModalOpen}
                formData={formData}
                setFormData={setFormData}
                handleSave={handleSave}
                handleDelete={handleDelete}
              />
              <AddressCard
                title="Shipping Address"
                addressData={formData.shippingAddress}
                setModalOpen={setShippingModalOpen}
                modalOpen={shippingModalOpen}
                formData={formData}
                setFormData={setFormData}
                handleSave={handleSave}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Address
