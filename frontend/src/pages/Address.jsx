import React, { useContext, useEffect, useState } from "react"

import { AccountCard, AddressCard } from "@cmp"
import { StoreContext } from "@context"
import { useToast } from "@providers"
import axios from "axios"

import { getuser } from "@/constants"

const Address = () => {
  const [billingModalOpen, setBillingModalOpen] = useState(false)
  const [shippingModalOpen, setShippingModalOpen] = useState(false)
  const [toBeUpdatedBilling, setToBeUpdatedBilling] = useState(false)
  const [toBeUpdatedShipping, setToBeUpdatedShipping] = useState(false)
  const { addToast } = useToast()
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState({})
  const { url, token, userID } = useContext(StoreContext)
  const [formData, setFormData] = useState({
    billingAddress: {},
    shippingAddress: {},
  })
  const handleSave = async (type) => {
    try {
      const endpoint =
        type === "billing"
          ? toBeUpdatedBilling
            ? `/api/user/update/${userID}/address`
            : `/api/user/add/${userID}/address`
          : toBeUpdatedShipping
            ? `/api/user/update/${userID}/address`
            : `/api/user/add/${userID}/address`

      let response = await axios.post(url + endpoint, formData, {
        headers: { token },
      })

      if (!response.data.success) {
        addToast("error", "Error", response.data.message)
        return
      }

      window.location.reload()
    } catch {
      addToast("error", "Error", "Error in saving the addresses")
    }
  }
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedUser = await getuser({ url, userID, token, addToast })
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
              />
              <AddressCard
                title="Shipping Address"
                addressData={formData.shippingAddress}
                setModalOpen={setShippingModalOpen}
                modalOpen={shippingModalOpen}
                formData={formData}
                setFormData={setFormData}
                handleSave={handleSave}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Address
