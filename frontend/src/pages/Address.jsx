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
  const { url, token } = useContext(StoreContext)
  const [formData, setFormData] = useState({
    billingAddress: {},
    shippingAddress: {},
  })
  const handleSave = async () => {
    try {
      const method =
        toBeUpdatedBilling || toBeUpdatedShipping ? axios.put : axios.post

      await method(`${url}/api/user/address`, formData, {
        headers: { token },
      })
      window.location.reload()
      addToast("success", "Success", "Updated address successfully!")
    } catch (err) {
      console.error("Error in saving addresses:", err)
      addToast("error", "Error", "Failed to save addresses!")
    }
  }
  const handleDelete = async (type) => {
    let updatedFormData
    if (type === "shippingAddress") {
      updatedFormData = {
        ...formData,
        shippingAddress: {},
      }
      setFormData(updatedFormData)
    } else {
      updatedFormData = {
        ...formData,
        billingAddress: {},
      }
      setFormData(updatedFormData)
    }
    try {
      const res = await axios.put(`${url}/api/user/address`, updatedFormData, {
        headers: { token },
      })
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }
      window.location.reload()
      addToast("success", "Success", "Deleted address successfully!")
    } catch (err) {
      console.error("Error deleting addresses:", err)
      addToast("error", "Error", "Failed to delete addresses!")
    }
  }
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedUser = await fetchUser({ url, token, addToast })
      if (fetchedUser) {
        setFormData({
          billingAddress: fetchedUser.billingAddress || {},
          shippingAddress: fetchedUser.shippingAddress || {},
        })
        setToBeUpdatedBilling(!!fetchedUser.billingAddress)
        setToBeUpdatedShipping(!!fetchedUser.shippingAddress)
      }
    }
    fetchUserData()
  }, [token])
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
