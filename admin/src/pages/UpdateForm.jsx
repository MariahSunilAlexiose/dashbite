import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Button, DropDown, Input, InputDropDown, Label, TextArea } from "@cmp"
import { PlusIcon, TrashIcon } from "@icons"
import { UploadAreaImg } from "@img"
import { useToast } from "@providers"
import axios from "axios"

import {
  backendImgURL,
  backendURL,
  categories,
  deliveryType,
  keyMapping,
  orderStatus,
  payment,
} from "@/constants"

const formFormatDate = (dateStr) => {
  const dateObj = new Date(dateStr)
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, "0")
  const day = String(dateObj.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getNameByID = (id, list) => {
  const item = list.find((i) => i["_id"] === id)
  return item ? item.name : ""
}

const UpdateForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { dataToBeUpdated, tableName } = location.state || {}
  const [formData, setFormData] = useState(dataToBeUpdated)
  const [users, setUsers] = useState([])
  const [dishes, setDishes] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [isFormatted, setIsFormatted] = useState(true)
  const [totalSum, setTotalSum] = useState(0)
  const [deliveryCost, setDeliveryCost] = useState(0)
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
      const res = await axios.put(
        `${backendURL}/${tableName}/${dataToBeUpdated._id}`,
        formData,
        {
          headers: {
            "Content-Type":
              tableName === "dish" ? "multipart/form-data" : "application/json",
            token: import.meta.env.VITE_ADMIN_TOKEN,
          },
        }
      )
      if (res.data.success === false) {
        return addToast("error", "Error", res.data.message)
      }
      addToast("success", "Success", "Updated!")
      setFormData({})
      navigate(-1)
    } catch (err) {
      console.error(err)
      addToast("error", "Error", `Error in updating: ${err}`)
    }
  }

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${backendURL}/user/all`, {
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
    if (Object.keys(formData)?.includes("userID")) {
      await fetchUserData()
    }
    if (Object.keys(formData)?.includes("items")) {
      await fetchItemData()
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (formData.items) {
      const newTotal = formData.items.reduce((acc, currItem) => {
        const dish = dishes.find((d) => d._id === currItem._id)
        return acc + currItem.quantity * (dish?.price || 0)
      }, 0)
      setTotalSum(newTotal)
      const updatedAmount = newTotal + deliveryCost
      setFormData((prevFormData) => ({
        ...prevFormData,
        amount: updatedAmount,
      }))
    }
  }, [formData.items, deliveryCost, dishes])

  useEffect(() => {
    if (formData.deliveryType) {
      if (formData.deliveryType === "Express Shipping") setDeliveryCost(15)
      else if (formData.deliveryType === "Pick Up")
        setDeliveryCost(-Math.abs((totalSum * 0.05).toFixed(2)))
      else setDeliveryCost(0)
    }
  }, [formData.deliveryType, totalSum])

  return (
    <div className="pt-10">
      <h2>
        Update{" "}
        {tableName &&
          tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase()}
      </h2>
      <div>
        <div className="pt-3">
          {Object.keys(formData)
            .filter((key) => key !== "_id" && key !== "__v" && key !== "amount")
            .map(
              (key) =>
                key === "image" && (
                  <div key={key}>
                    <Label>Upload Image</Label>
                    <div className="flex items-center gap-3">
                      <label htmlFor="image">
                        <div className="flex items-center justify-center">
                          <img
                            src={
                              image
                                ? URL.createObjectURL(image)
                                : formData.image
                                  ? `${backendImgURL}/${formData.image}`
                                  : UploadAreaImg
                            }
                            alt={formData.name || "Image"}
                            className="w-32 cursor-pointer"
                          />
                        </div>
                      </label>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setImage(false)
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            image: null,
                          }))
                        }}
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
                )
            )}
        </div>
        <div className="flex gap-5 pt-3">
          <div className="flex flex-1 flex-col gap-3">
            {Object.keys(formData)
              .filter(
                (key) =>
                  key !== "_id" &&
                  key !== "__v" &&
                  key !== "amount" &&
                  key !== "image"
              )
              .map((key) =>
                key === "userID" ? (
                  <div key={key} className="pt-3">
                    <Label className="block text-sm font-medium text-gray-700">
                      User
                    </Label>
                    <InputDropDown
                      label="users"
                      options={users}
                      onChange={(id) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          userID: id,
                        }))
                      }}
                      defaultValue={getNameByID(formData.userID, users, "user")}
                      disabled={true}
                    />
                  </div>
                ) : key === "payment" ? (
                  <div className="pt-3">
                    <Label className="block text-sm font-medium text-gray-700">
                      Payment Status
                    </Label>
                    <DropDown
                      options={payment}
                      onChange={(status) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          payment: status === "Not Paid" ? false : true,
                        }))
                      }}
                      defaultValue={
                        formData.payment === true ? "Paid" : "Not Paid"
                      }
                    />
                  </div>
                ) : key === "category" ? (
                  <div>
                    <Label>Category</Label>
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
                ) : (
                  key === "price" && (
                    <div key={key}>
                      <Label className="block text-sm font-medium text-gray-700">
                        Price
                      </Label>
                      <Input
                        name={key}
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        min="0"
                        value={formData[key] || ""}
                        onChange={(e) => {
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            price: e.target.value,
                          }))
                        }}
                        required
                      />
                    </div>
                  )
                )
              )}
          </div>

          <div className="flex flex-1 flex-col gap-3">
            {Object.keys(formData)
              .filter(
                (key) =>
                  key !== "_id" &&
                  key !== "__v" &&
                  key !== "amount" &&
                  key !== "payment" &&
                  key !== "address" &&
                  key !== "items" &&
                  key !== "deliveryType" &&
                  key !== "userID" &&
                  key !== "image" &&
                  key !== "description" &&
                  key !== "category" &&
                  key !== "price"
              )
              .map((key) =>
                key === "date" ? (
                  <div key={key} className="pt-3">
                    <Label className="block text-sm font-medium text-gray-700">
                      Date
                    </Label>
                    <Input
                      type="date"
                      id="date"
                      name="date"
                      value={
                        isFormatted
                          ? formFormatDate(formData.date)
                          : formData.date
                      }
                      onChange={(e) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          date: e.target.value,
                        }))
                        setIsFormatted(false)
                      }}
                      disabled={true}
                    />
                  </div>
                ) : key === "status" ? (
                  <div className="pt-3">
                    <Label className="block text-sm font-medium text-gray-700">
                      Order Status
                    </Label>
                    <DropDown
                      options={orderStatus}
                      defaultValue={formData.status}
                      onChange={(type) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          status: type,
                        }))
                      }}
                    />
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
                        key === "rating" ||
                        key === "salary" ||
                        key === "unitPrice" ||
                        key === "price" ||
                        key === "quantity"
                          ? "number"
                          : key === "phone"
                            ? "tel"
                            : key === "email"
                              ? "email"
                              : "text"
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      step={
                        key === "rating"
                          ? "0.1"
                          : key === "salary" ||
                              key === "unitPrice" ||
                              key === "price"
                            ? "0.01"
                            : undefined
                      }
                      min={
                        key === "rating" || key === "unitPrice"
                          ? "0"
                          : key === "salary"
                            ? "17.30"
                            : key === "quantity"
                              ? "1"
                              : undefined
                      }
                      max={key === "rating" ? "5" : undefined}
                      value={formData[key] || ""}
                      onChange={(e) => {
                        const { name, value } = e.target
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          [name]: value,
                        }))
                      }}
                      required
                    />
                  </div>
                )
              )}
          </div>
        </div>
        <div className="pt-3">
          {Object.keys(formData)
            .filter((key) => key !== "_id" && key !== "__v" && key !== "amount")
            .map((key) =>
              key === "address" ? (
                <div key={key} className="pt-3">
                  <Label className="block text-sm font-medium text-gray-700">
                    Address
                  </Label>
                  <div className="flex flex-col gap-4 pt-4">
                    <div className="flex gap-4">
                      <Input
                        type="name"
                        placeholder="First Name"
                        name="firstName"
                        onChange={onChangeHandler}
                        value={formData.address.firstName}
                        required
                      />
                      <Input
                        type="name"
                        placeholder="Last Name"
                        name="lastName"
                        onChange={onChangeHandler}
                        value={formData.address.lastName}
                        required
                      />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email"
                      name="email"
                      onChange={onChangeHandler}
                      value={formData.address.email}
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Street"
                      name="street"
                      onChange={onChangeHandler}
                      value={formData.address.street}
                      required
                    />
                    <div className="flex gap-4">
                      <Input
                        type="text"
                        placeholder="City"
                        name="city"
                        onChange={onChangeHandler}
                        value={formData.address.city}
                        required
                      />
                      <Input
                        type="text"
                        placeholder="State"
                        name="state"
                        onChange={onChangeHandler}
                        value={formData.address.state}
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <Input
                        type="text"
                        placeholder="Zip Code"
                        name="zipcode"
                        onChange={onChangeHandler}
                        value={formData.address.zipcode}
                        required
                      />
                      <Input
                        type="text"
                        placeholder="Country"
                        name="country"
                        onChange={onChangeHandler}
                        value={formData.address.country}
                        required
                      />
                    </div>
                    <Input
                      type="phone"
                      placeholder="Phone"
                      name="phone"
                      onChange={onChangeHandler}
                      value={formData.address.phone}
                      required
                    />
                  </div>
                </div>
              ) : key === "items" ? (
                <div key={key} className="pt-3">
                  <div className="flex justify-between">
                    <Label className="block text-sm font-medium text-gray-700">
                      Menu Items
                    </Label>
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
                      <img src={PlusIcon} alt="Add Icon" className="h-4 w-4" />
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
                        <div key={index} className="flex gap-3">
                          <div className="w-full">
                            <Label className="block text-sm font-medium text-gray-700">
                              Menu Item
                            </Label>
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
                              defaultValue={getNameByID(
                                item._id,
                                dishes,
                                "dish"
                              )}
                            />
                          </div>
                          <div className="w-full">
                            <Label className="block text-sm font-medium text-gray-700">
                              Quantity
                            </Label>
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
                          <div className="flex gap-3">
                            {selectedDish?.price > 0 && (
                              <div
                                className={`flex flex-col items-center gap-1.5 ${index === 0 ? "p-0" : "px-4"}`}
                              >
                                {index === 0 && (
                                  <Label className="block text-sm font-medium text-gray-700">
                                    Subtotal
                                  </Label>
                                )}
                                <p
                                  className={`${index === 0 ? "mt-1" : "mt-6"}`}
                                >
                                  ${subtotal}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center justify-center gap-3 py-8 align-middle">
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    items: prevFormData.items.filter(
                                      (i) => i._id !== item._id
                                    ), // Remove the matching item
                                  }))
                                }}
                              >
                                <img
                                  src={TrashIcon}
                                  alt="Trash Icon"
                                  className="h-4 w-4"
                                />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                  {totalSum > 0 && (
                    <div className="flex justify-end pl-2 pr-10 text-center">
                      <div className="border-t border-gray-500 px-5">
                        <p className="mt-1 font-bold">${totalSum}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : key === "deliveryType" ? (
                <div key={key} className="flex justify-between gap-5">
                  <div className="w-full">
                    <Label className="block text-sm font-medium text-gray-700">
                      Delivery Type
                    </Label>
                    <DropDown
                      defaultValue={formData.deliveryType}
                      options={deliveryType}
                      onChange={(type) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          deliveryType: type,
                        }))
                      }}
                    />
                  </div>
                  <div className="pr-14">
                    <div className="pt-3">
                      <p className="mt-1">${deliveryCost}</p>
                    </div>
                  </div>
                </div>
              ) : (
                key === "description" && (
                  <div>
                    <Label>Description</Label>
                    <TextArea
                      placeholder=""
                      value={formData.description || ""}
                      onChange={(e) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          description: e.target.value,
                        }))
                      }}
                    />
                  </div>
                )
              )
            )}
        </div>
        {formData.amount && (
          <div className="mr-13 flex justify-end gap-3 pt-3 text-right">
            <p className="font-black">Total:</p>
            <p className="mt-0 font-black">${formData.amount}</p>
          </div>
        )}
        <div className="flex justify-end pt-3">
          <Button onClick={(e) => handleSubmit(e)}>Update</Button>
        </div>
      </div>
    </div>
  )
}

export default UpdateForm
