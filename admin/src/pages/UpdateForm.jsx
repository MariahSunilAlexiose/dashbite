import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import {
  Button,
  DropDown,
  Input,
  InputDropDown,
  InputDropDownWithAdd,
  Label,
  MultiSelectDropDown,
  TextArea,
} from "@cmp"
import { PlusIcon, TrashIcon } from "@icons"
import { UploadAreaImg } from "@img"
import { useToast } from "@providers"
import axios from "axios"

import {
  allergenList,
  backendImgURL,
  backendURL,
  deliveryType,
  fetchData,
  ingredientList,
  keyMapping,
  onChangeHandler,
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

const UpdateForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { dataToBeUpdated, tableName } = location.state || {}
  const [formData, setFormData] = useState(dataToBeUpdated)
  const [users, setUsers] = useState([])
  const [dishes, setDishes] = useState([])
  const [cuisines, setCuisines] = useState([])
  const [categories, setCategories] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [isFormatted, setIsFormatted] = useState(true)
  const [totalSum, setTotalSum] = useState(0)
  const [deliveryCost, setDeliveryCost] = useState(0)
  const [image, setImage] = useState(false)
  const [images, setImages] = useState(dataToBeUpdated.images)
  const [ingredients, setIngredients] = useState(ingredientList)
  const [allergens, setAllergens] = useState(allergenList)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(
        `${backendURL}/${tableName}/${dataToBeUpdated._id}`,
        formData,
        {
          headers: {
            "Content-Type":
              tableName === "dish" || tableName === "category"
                ? "multipart/form-data"
                : "application/json",
            token: import.meta.env.VITE_ADMIN_TOKEN,
          },
        }
      )
      if (!res.data.success) {
        console.error(res.data.message)
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

  useEffect(() => {
    fetchData(formData, {
      setUsers,
      setDishes,
      setCategories,
      setCuisines,
      setRestaurants,
    })
  }, [formData])

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

  const filteredKeys = Object.keys(formData).filter(
    (key) =>
      ![
        "_id",
        "__v",
        "createdAt",
        "updatedAt",
        "restaurant",
        "cuisines",
        "category",
        "amount",
      ].includes(key)
  )
  const singleLineKeys = filteredKeys.filter((key) =>
    [
      "servingSize",
      "calories",
      "fat",
      "protein",
      "carbs",
      "ingredients",
      "allergens",
    ].includes(key)
  )
  const fullWidthKeys = filteredKeys.filter((key) =>
    [
      "image",
      "images",
      "description",
      "address",
      "items",
      "deliveryType",
      "streetAddress",
    ].includes(key)
  )
  const remainingKeys = filteredKeys.filter(
    (key) => !fullWidthKeys.includes(key) && !singleLineKeys.includes(key)
  )
  const halfLength = Math.ceil(remainingKeys.length / 2)
  const firstColumnKeys = remainingKeys.slice(0, halfLength)
  const secondColumnKeys = remainingKeys.slice(halfLength)

  const keyComponents = {
    userID: (
      <div key="user">
        <Label htmlFor="user">User</Label>
        <InputDropDown
          label="users"
          options={users}
          onChange={(id) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              userID: id,
            }))
          }}
          defaultValue={formData.userID}
          disabled={true}
        />
      </div>
    ),
    payment: (
      <div key="payment">
        <Label htmlFor="payment">Payment Status</Label>
        <DropDown
          options={payment}
          defaultValue={formData.payment === true ? "Paid" : "Not Paid"}
          onChange={(status) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              payment: status === "Not Paid" ? false : true,
            }))
          }}
        />
      </div>
    ),
    categoryID: (
      <div key="category">
        <Label htmlFor="category">Category</Label>
        <DropDown
          label="category"
          options={categories}
          defaultValue={formData.categoryID}
          onChange={(id) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              categoryID: id,
            }))
          }}
        />
      </div>
    ),
    date: (
      <div key="date" className="pt-3">
        <Label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </Label>
        <Input
          type="date"
          id="date"
          name="date"
          value={isFormatted ? formFormatDate(formData.date) : formData.date}
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
    ),
    status: (
      <div key="status">
        <Label htmlFor="status">Order Status</Label>
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
    ),
    cuisineIDs: (
      <div key="cuisine">
        <Label htmlFor="cuisine">Cuisines</Label>
        <MultiSelectDropDown
          options={cuisines}
          defaultValue={dataToBeUpdated.cuisineIDs}
          onChange={(selectedIDs) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              cuisineIDs: selectedIDs,
            }))
          }}
        />
      </div>
    ),
    dishIDs: (
      <div key="dish">
        <Label htmlFor="dish">Dishes</Label>
        <MultiSelectDropDown
          options={dishes}
          defaultValue={dataToBeUpdated.dishIDs}
          onChange={(selectedIDs) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              dishIDs: selectedIDs,
            }))
          }}
        />
      </div>
    ),
    restaurantID: (
      <div key="restaurant">
        <Label htmlFor="restaurant">Restaurant</Label>
        <DropDown
          options={restaurants}
          defaultValue={formData.restaurant && formData.restaurant.name}
          onChange={(id) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              restaurantID: id,
            }))
          }}
        />
      </div>
    ),
  }

  const renderField = (key) =>
    keyComponents[key] ||
    (["price", "rating"].includes(key) ? (
      <div key={key}>
        <Label htmlFor={key}>
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </Label>
        <Input
          name={key}
          type="number"
          value={formData[key] ?? 0} // Failsafe: Default to 0
          onChange={(e) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              [e.target.name]: parseFloat(e.target.value) || 0, // Ensure valid number
            }))
          }}
          min="0"
          step="1"
          required
        />
      </div>
    ) : (
      <div key={key}>
        <Label htmlFor={key}>
          {keyMapping[key] || key.replace(/\b\w/g, (c) => c.toUpperCase())}
        </Label>
        <Input
          name={key}
          type="text"
          value={formData[key] || ""}
          onChange={(e) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              [e.target.name]: e.target.value,
            }))
          }}
        />
      </div>
    ))

  return (
    <div className="pt-10">
      <h2>
        Update{" "}
        {tableName &&
          tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase()}
      </h2>

      <div className="flex flex-col gap-4">
        {/* images */}
        <div className="flex flex-col gap-4">
          {fullWidthKeys.map((key) => {
            if (key === "image") {
              return (
                <div key="image">
                  <Label htmlFor="image">Upload Image</Label>
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
                        image: e.target.files[0]
                          ? e.target.files[0]
                          : prevFormData.image,
                      }))
                    }}
                  />
                </div>
              )
            }
            if (key === "images") {
              return (
                <div key="images">
                  <Label htmlFor="images">Upload Images</Label>

                  <label
                    htmlFor="images"
                    className="flex cursor-pointer flex-wrap items-center gap-3"
                  >
                    {images.length > 0 ? (
                      images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={
                              img instanceof File
                                ? URL.createObjectURL(img)
                                : `${backendImgURL}/${img}`
                            }
                            alt={`Uploaded Image ${index + 1}`}
                            className="h-32 w-32"
                          />

                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() =>
                              setImages(images.filter((_, i) => i !== index))
                            }
                          >
                            <img
                              src={TrashIcon}
                              alt="Trash Icon"
                              className="h-4 w-4"
                            />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <img
                        src={UploadAreaImg}
                        alt="Upload Area Placeholder"
                        className="w-32"
                      />
                    )}
                  </label>

                  <input
                    type="file"
                    name="images"
                    id="images"
                    hidden
                    multiple
                    required
                    onChange={(e) => {
                      setImages((prevImages) => {
                        const updatedImages = [...prevImages, ...e.target.files]

                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          images: updatedImages, // ✅ Now using updatedImages instead of prevImages
                        }))

                        return updatedImages // ✅ Properly return updated state
                      })
                    }}
                  />
                </div>
              )
            }
            return null
          })}
        </div>

        {/* rest of the keys */}
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-4">
            {firstColumnKeys.map((key) => renderField(key))}
          </div>

          <div className="flex flex-1 flex-col gap-4">
            {secondColumnKeys.map((key) => renderField(key))}
          </div>
        </div>

        {/* addresses + items (with quantity) + deliveryType + description */}
        <div className="pt-3">
          {fullWidthKeys
            .filter((key) => key !== "image")
            .map((key) =>
              key === "address" ? (
                <div key="address" className="pt-3">
                  <Label htmlFor="address">Address</Label>
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
              ) : key === "streetAddress" ? (
                <div key="streetAddress" className="pt-3">
                  <Label htmlFor="address">Address</Label>
                  <div className="flex flex-col gap-4 pt-4">
                    <Input
                      type="text"
                      placeholder="Street"
                      name="street"
                      onChange={onChangeHandler}
                      value={formData.streetAddress.street}
                      required
                    />
                    <div className="flex gap-4">
                      <Input
                        type="text"
                        placeholder="City"
                        name="city"
                        onChange={onChangeHandler}
                        value={formData.streetAddress.city}
                        required
                      />
                      <Input
                        type="text"
                        placeholder="State"
                        name="state"
                        onChange={onChangeHandler}
                        value={formData.streetAddress.state}
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <Input
                        type="text"
                        placeholder="Zip Code"
                        name="zipcode"
                        onChange={onChangeHandler}
                        value={formData.streetAddress.zipcode}
                        required
                      />
                      <Input
                        type="text"
                        placeholder="Country"
                        name="country"
                        onChange={onChangeHandler}
                        value={formData.streetAddress.country}
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : key === "items" ? (
                <div key="items" className="pt-3">
                  <div className="flex justify-between">
                    <Label htmlFor="items">Menu Items</Label>
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
                            <Label htmlFor="item">Menu Item</Label>
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
                              defaultValue={item._id}
                            />
                          </div>
                          <div className="w-full">
                            <Label htmlFor="quantity">Quantity</Label>
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
                                  <Label htmlFor="subtotal">Subtotal</Label>
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
                <div key="deliveryType" className="flex justify-between gap-5">
                  <div className="w-full">
                    <Label htmlFor="deliveryType">Delivery Type</Label>
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
                  <div key="description">
                    <Label htmlFor="description">Description</Label>
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

        {/* ingredients + allergens */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            {singleLineKeys
              .filter((key) => key === "ingredients" || key === "allergens")
              .map((key) =>
                key === "ingredients" ? (
                  <div key="ingredients" className="flex-1">
                    <Label htmlFor="ingredients">Main Ingredients</Label>
                    <InputDropDownWithAdd
                      options={ingredients}
                      setOptions={setIngredients}
                      defaultValue={formData.ingredients}
                      onChange={(selectedIngredients) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          ingredients: selectedIngredients,
                        }))
                      }}
                    />
                  </div>
                ) : (
                  <div key="allergens" className="flex-1">
                    <Label htmlFor="allergens">Allergens</Label>
                    <InputDropDownWithAdd
                      options={allergens}
                      setOptions={setAllergens}
                      defaultValue={formData.allergens}
                      onChange={(selectedAllergens) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          allergens: selectedAllergens,
                        }))
                      }}
                    />
                  </div>
                )
              )}
          </div>
        </div>

        {/* nutrition */}
        {singleLineKeys && singleLineKeys.length > 0 && (
          <div className="flex flex-col gap-4">
            <h4>Nutrition Facts</h4>
            <div className="flex gap-3">
              {singleLineKeys
                .filter((key) =>
                  [
                    "servingSize",
                    "calories",
                    "fat",
                    "protein",
                    "carbs",
                  ].includes(key)
                )
                .map((nutrient) => (
                  <div key={nutrient} className="flex-1">
                    {nutrient === "servingSize" ? (
                      renderField(nutrient)
                    ) : (
                      <div>
                        <Label htmlFor={nutrient}>
                          {keyMapping[nutrient] || nutrient}
                        </Label>
                        <Input
                          name={nutrient}
                          type="number"
                          value={formData[nutrient] || ""}
                          onChange={(e) => {
                            const { name, value } = e.target
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              [name]: parseFloat(value),
                            }))
                          }}
                          step="1"
                          min="0"
                          required
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {formData.amount && (
          <div className="mr-13 flex justify-end gap-3 pt-3 text-right">
            <p className="font-black">Total:</p>
            <p className="mt-0 font-black">${formData.amount}</p>
          </div>
        )}

        <div className="flex justify-end pt-3">
          <Button variant="primary" onClick={(e) => handleSubmit(e)}>
            Update
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UpdateForm
