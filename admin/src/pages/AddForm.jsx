import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Button, DropDown, Input, InputDropDown } from "@cmp"
import { PlusIcon, TrashIcon } from "@icons"
import { UploadAreaImg } from "@img"
import { useToast } from "@providers"
import axios from "axios"

import {
  backendURL,
  categories,
  deliveryType,
  keyMapping,
  orderStatus,
  payment,
} from "@/constants"

const AddForm = () => {
  const location = useLocation()
  const { toBeAddedKeys, tableName } = location.state || {}
  const [formData, setFormData] = useState({})
  const { addToast } = useToast()
  const [users, setUsers] = useState([])
  const [dishes, setDishes] = useState([])
  const navigate = useNavigate()
  const [selectedItems, setSelectedItems] = useState([])
  const [image, setImage] = useState(false)

  const onChangeHandler = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      address: { ...prevFormData.address, [e.target.name]: e.target.value },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${backendURL}/${tableName}`, formData, {
        headers: {
          "Content-Type":
            tableName === "dish" ? "multipart/form-data" : "application/json",
          token: import.meta.env.VITE_ADMIN_TOKEN,
        },
      })
      if (res.data.success === false) {
        return addToast("error", "Error", res.data.message)
      }
      addToast("success", "Success", "Added")
      setFormData({})
      if (tableName === "dish") navigate("/dishes")
      else if (tableName === "order") navigate("/orders")
    } catch (err) {
      console.error(err)
      addToast("error", "Error", `Error in adding dish: ${err}`)
    }
  }

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${backendURL}/user`, {
        headers: {
          token: import.meta.env.VITE_ADMIN_TOKEN,
        },
      })
      setUsers(res.data.data)
    } catch (err) {
      console.error(err)
      addToast("error", "Error", `Error fetching user data: ${err}`)
    }
  }

  const fetchItemData = async () => {
    try {
      const response = await axios.get(`${backendURL}/dish`)
      const updatedData = response.data.data.map((item) => ({
        ...item,
        quantity: 0,
      }))
      setDishes(updatedData)
    } catch (err) {
      console.error(err)
      addToast("error", "Error", `Error fetching item data: ${err}`)
    }
  }

  const fetchData = async () => {
    if (toBeAddedKeys?.includes("userID")) {
      await fetchUserData()
    }
    if (toBeAddedKeys?.includes("items")) {
      await fetchItemData()
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (formData.items) {
      const totalSum = formData.items.reduce((acc, currItem) => {
        const dish = dishes.find((d) => d._id === currItem._id)
        return acc + currItem.quantity * (dish?.price || 0)
      }, 0)

      setFormData((prevFormData) => ({
        ...prevFormData,
        amount: totalSum,
      }))
    }
  }, [formData.items, dishes])

  return (
    <div className="pt-10">
      <h2>
        Add to{" "}
        {tableName &&
          tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase()}
      </h2>
      <form>
        {toBeAddedKeys &&
          toBeAddedKeys
            .filter((key) => key !== `${tableName}ID`)
            .map((key) => (
              <div key={key} className="py-5">
                {key === "userID" ? (
                  <div>
                    <label
                      htmlFor="user"
                      className="block text-sm font-medium text-gray-700"
                    >
                      User
                    </label>
                    <InputDropDown
                      label="users"
                      options={users}
                      onChange={(id) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          userID: id,
                        }))
                      }}
                    />
                  </div>
                ) : key === "payment" ? (
                  <div>
                    <label
                      htmlFor="payment"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Payment Status
                    </label>
                    <DropDown
                      options={payment}
                      defaultValue={payment[0]}
                      onChange={(status) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          payment: status === "Not Paid" ? false : true,
                        }))
                      }}
                    />
                  </div>
                ) : key === "deliveryType" ? (
                  <div>
                    <label
                      htmlFor="deliveryType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Delivery Type
                    </label>
                    <DropDown
                      options={deliveryType}
                      defaultValue={deliveryType[0]}
                      onChange={(type) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          deliveryType: type,
                        }))
                      }}
                    />
                  </div>
                ) : key === "status" ? (
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Order Status
                    </label>
                    <DropDown
                      options={orderStatus}
                      defaultValue={orderStatus[0]}
                      onChange={(type) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          status: type,
                        }))
                      }}
                    />
                  </div>
                ) : key === "address" ? (
                  <div>
                    <label
                      htmlFor="a"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <div className="flex flex-col gap-4 pt-4">
                      <div className="flex gap-4">
                        <Input
                          type="name"
                          placeholder="First Name"
                          name="firstName"
                          onChange={onChangeHandler}
                          required
                        />
                        <Input
                          type="name"
                          placeholder="Last Name"
                          name="lastName"
                          onChange={onChangeHandler}
                          required
                        />
                      </div>
                      <Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={onChangeHandler}
                        required
                      />
                      <Input
                        type="text"
                        placeholder="Street"
                        name="street"
                        onChange={onChangeHandler}
                        required
                      />
                      <div className="flex gap-4">
                        <Input
                          type="text"
                          placeholder="City"
                          name="city"
                          onChange={onChangeHandler}
                          required
                        />
                        <Input
                          type="text"
                          placeholder="State"
                          name="state"
                          onChange={onChangeHandler}
                          required
                        />
                      </div>
                      <div className="flex gap-4">
                        <Input
                          type="text"
                          placeholder="Zip Code"
                          name="zipcode"
                          onChange={onChangeHandler}
                          required
                        />
                        <Input
                          type="text"
                          placeholder="Country"
                          name="country"
                          onChange={onChangeHandler}
                          required
                        />
                      </div>
                      <Input
                        type="phone"
                        placeholder="Phone"
                        name="phone"
                        onChange={onChangeHandler}
                        required
                      />
                    </div>
                  </div>
                ) : key === "category" ? (
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <DropDown
                      options={categories}
                      defaultValue={formData.category}
                      onChange={(status) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          category: status,
                        }))
                      }}
                    />
                  </div>
                ) : key === "image" ? (
                  <div>
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Upload Image
                    </label>
                    <div className="flex items-center gap-3">
                      <label htmlFor="image">
                        <img
                          src={
                            image ? URL.createObjectURL(image) : UploadAreaImg
                          }
                          alt="Upload Area Image"
                          className="w-32 cursor-pointer"
                        />
                      </label>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setImage(false)}
                      >
                        <img
                          src={TrashIcon}
                          alt="Trash Icon"
                          className="h-4 w-4"
                        />
                      </Button>
                    </div>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      hidden
                      required
                      onChange={(e) => {
                        setImage(e.target.files[0])
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          image: e.target.files[0],
                        }))
                      }}
                    />
                  </div>
                ) : key === "items" ? (
                  <div>
                    <div className="flex justify-between">
                      <label
                        htmlFor="menuItems"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Menu Items
                      </label>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => {
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            items: [
                              ...(prevFormData.items || []),
                              { _id: 0, quantity: 1 },
                            ],
                          }))
                        }}
                        className="rounded-full!"
                      >
                        <img
                          src={PlusIcon}
                          alt="Add Icon"
                          className="h-4 w-4"
                        />
                      </Button>
                    </div>

                    {formData.items &&
                      formData.items.map((item, index) => {
                        const selectedDish = dishes.find(
                          (dish) => dish._id === item._id
                        )
                        const subtotal =
                          item.quantity * (selectedDish?.price || 0)

                        return (
                          <div key={index} className="flex gap-3 py-3">
                            <div className="w-full">
                              <label
                                htmlFor={`menuitem-${index}`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                Menu Item
                              </label>
                              <InputDropDown
                                label="menuitem"
                                options={dishes.filter(
                                  (dish) => !selectedItems.includes(dish._id)
                                )}
                                onChange={(newOrderItemID) => {
                                  setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    items: prevFormData.items.map((i, idx) =>
                                      idx === index
                                        ? { ...i, _id: newOrderItemID }
                                        : i
                                    ),
                                  }))
                                  setSelectedItems((prevSelected) => [
                                    ...prevSelected,
                                    newOrderItemID,
                                  ])
                                }}
                              />
                            </div>
                            <div className="w-full">
                              <label className="block text-sm font-medium text-gray-700">
                                Quantity
                              </label>
                              <Input
                                name={`quantity-${index}`}
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    items: prevFormData.items.map((i, idx) =>
                                      idx === index
                                        ? {
                                            ...i,
                                            quantity: parseInt(
                                              e.target.value,
                                              10
                                            ),
                                          }
                                        : i
                                    ),
                                  }))
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                min={1}
                                required
                              />
                            </div>
                            {selectedDish?.price > 0 && (
                              <div className="flex flex-col items-center">
                                {/* SubTotal */}
                                <label className="block text-sm font-medium text-gray-700">
                                  Subtotal
                                </label>
                                <p className="mt-1">${subtotal}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {keyMapping[key] || key}
                    </label>
                    <Input
                      name={key}
                      type={
                        key === "price" || key === "rating" ? "number" : "text"
                      }
                      onChange={(e) => {
                        const { name, value } = e.target
                        let parsedValue
                        if (name === "price" || key === "rating") {
                          parsedValue = parseFloat(value)
                        } else {
                          parsedValue = value
                        }
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          [name]: parsedValue,
                        }))
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      step={
                        key === "rating"
                          ? "0.1"
                          : key === "price"
                            ? "0.01"
                            : undefined
                      }
                      min={
                        key === "price"
                          ? "1"
                          : key === "rating"
                            ? "0"
                            : undefined
                      }
                      max={key === "rating" ? "5" : undefined}
                      required
                    />
                  </div>
                )}
              </div>
            ))}
        <div className="flex justify-end">
          <Button onClick={(e) => handleSubmit(e)}>Add</Button>
        </div>
      </form>
    </div>
  )
}

export default AddForm
