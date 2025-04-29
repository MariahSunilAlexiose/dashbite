import React from "react"

import { Button, Input } from "@cmp"
import PropTypes from "prop-types"

const AddressForm = ({
  addressType,
  addressData,
  setFormData,
  handleSave,
  handleDelete,
}) => {
  return (
    <form className="flex flex-col gap-4">
      {["name", "phone", "street", "city", "state", "zip", "country"].map(
        (field) => (
          <Input
            key={field}
            type="text"
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={addressData[field] || ""}
            onChange={(e) => {
              const { value } = e.target
              setFormData((prevFormData) => ({
                ...prevFormData,
                [addressType]: {
                  ...prevFormData[addressType],
                  [field]: value,
                },
              }))
            }}
            className="rounded border px-2 py-1"
            required
          />
        )
      )}
      <div className="flex gap-5">
        <Button onClick={() => handleSave(addressType)}>Save</Button>
        <Button variant="destructive" onClick={() => handleDelete(addressType)}>
          Delete
        </Button>
      </div>
    </form>
  )
}

AddressForm.propTypes = {
  addressType: PropTypes.string.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  addressData: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    street: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
    country: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
}

export default AddressForm
