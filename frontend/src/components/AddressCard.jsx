import React from "react"

import { AddressForm, Button, Modal } from "@cmp"
import { PencilSquareIcon } from "@icons"
import PropTypes from "prop-types"

const AddressCard = ({
  title,
  addressData,
  setModalOpen,
  modalOpen,
  formData,
  setFormData,
  handleSave,
  handleDelete,
}) => {
  const isEmpty =
    !addressData ||
    Object.keys(addressData).length === 0 ||
    Object.values(addressData).every((value) => value === "")
  return (
    <div className="border-muted w-full max-w-sm rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        <Button
          variant="ghost"
          onClick={() => setModalOpen(true)}
          className="text-sm text-blue-500 hover:underline"
        >
          <img src={PencilSquareIcon} alt="Edit" className="h-4 w-4" />
        </Button>
        {modalOpen && (
          <Modal
            title={isEmpty ? `Add ${title}` : `Update ${title}`}
            onClose={() => setModalOpen(false)}
          >
            <AddressForm
              addressType={
                title.toLowerCase().includes("billing")
                  ? "billingAddress"
                  : "shippingAddress"
              }
              addressData={
                formData[
                  title.toLowerCase().includes("billing")
                    ? "billingAddress"
                    : "shippingAddress"
                ]
              }
              setFormData={setFormData}
              handleSave={handleSave}
              handleDelete={handleDelete}
            />
          </Modal>
        )}
      </div>
      {addressData &&
        Object.keys(addressData).length > 0 &&
        Object.values(addressData).every((value) => value !== "") && (
          <div className="text-muted">
            <p className="m-0">{addressData.name}</p>
            <p className="m-0">{addressData.phone}</p>
            <p className="m-0">
              {addressData.street}, {addressData.city}, {addressData.state},{" "}
              {addressData.zip}, {addressData.country}
            </p>
          </div>
        )}
    </div>
  )
}

AddressCard.propTypes = {
  title: PropTypes.string.isRequired,
  addressData: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    street: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
    country: PropTypes.string,
  }).isRequired,
  setModalOpen: PropTypes.func.isRequired,
  modalOpen: PropTypes.boolean,
  formData: PropTypes.shape({
    billingAddress: PropTypes.shape({
      name: PropTypes.string,
      phone: PropTypes.string,
      street: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zip: PropTypes.string,
      country: PropTypes.string,
    }),
    shippingAddress: PropTypes.shape({
      name: PropTypes.string,
      phone: PropTypes.string,
      street: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zip: PropTypes.string,
      country: PropTypes.string,
    }),
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

export default AddressCard
