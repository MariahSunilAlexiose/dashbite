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
  backendURL,
  deliveryType,
  fetchTableData,
  ingredientList,
  keyMapping,
  onChangeHandler,
  orderStatus,
  payment,
} from "@/constants"

const AddForm = () => {
  const location = useLocation()
  const { toBeAddedKeys, tableName } = location.state || {}
  const [formData, setFormData] = useState({})
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [selectedItems, setSelectedItems] = useState([])
  const [users, setUsers] = useState([])
  const [dishes, setDishes] = useState([])
  const [cuisines, setCuisines] = useState([])
  const [categories, setCategories] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [image, setImage] = useState(false)
  const [images, setImages] = useState([])
  const [ingredients, setIngredients] = useState(ingredientList)
  const [allergens, setAllergens] = useState(allergenList)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let res
      res = await axios.post(`${backendURL}/${tableName}`, formData, {
        headers: {
          "Content-Type":
            tableName === "dish" ||
            tableName === "category" ||
            tableName === "cuisine" ||
            tableName === "restaurant"
              ? "multipart/form-data"
              : "application/json",
          token: import.meta.env.VITE_ADMIN_TOKEN,
        },
      })
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }
      addToast("success", "Success", "Added")
      setFormData({})
      navigate(-1)
    } catch (err) {
      console.error("Error adding:", err)
      addToast("error", "Error", "Failed to add!")
    }
  }

  const fetches = {
    dish: [
      {
        name: "user",
        setter: setUsers,
        options: { token: import.meta.env.VITE_ADMIN_TOKEN },
      },
      { name: "category", setter: setCategories },
      { name: "cuisine", setter: setCuisines },
      { name: "restaurant", setter: setRestaurants },
    ],
    restaurant: [{ name: "cuisine", setter: setCuisines }],
    order: [
      { name: "dish", setter: setDishes },
      {
        name: "user",
        setter: setUsers,
        options: { token: import.meta.env.VITE_ADMIN_TOKEN },
      },
    ],
  }

  useEffect(() => {
    fetchTableData(fetches, tableName)
  }, [])

  const filteredKeys = toBeAddedKeys.filter((key) => !["_id"].includes(key))
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
    user: (
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
        />
      </div>
    ),
    payment: (
      <div key="payment">
        <Label htmlFor="payment">Payment Status</Label>
        <DropDown
          options={payment}
          defaultValue={payment[0].label}
          onChange={(status) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              payment: status === "Not Paid" ? false : true,
            }))
          }}
        />
      </div>
    ),
    status: (
      <div key="status">
        <Label htmlFor="status">Order Status</Label>
        <DropDown
          options={orderStatus}
          defaultValue={orderStatus[0].label}
          onChange={(type) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              status: type,
            }))
          }}
        />
      </div>
    ),
    category: (
      <div key="category">
        <Label htmlFor="category">Category</Label>
        <DropDown
          options={categories}
          onChange={(status) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              categoryID: status,
            }))
          }}
        />
      </div>
    ),
    cuisines: (
      <div key="cuisine">
        <Label htmlFor="cuisine">Cuisines</Label>
        <MultiSelectDropDown
          options={cuisines}
          onChange={(selectedIDs) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              cuisineIDs: selectedIDs,
            }))
          }}
        />
      </div>
    ),
    dishes: (
      <div key="dish">
        <Label htmlFor="dish">Dish</Label>
        <MultiSelectDropDown
          options={dishes}
          onChange={(selectedIDs) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              dishIDs: selectedIDs,
            }))
          }}
        />
      </div>
    ),
    restaurant: (
      <div key="restaurant">
        <Label htmlFor="restaurant">Restaurant</Label>
        <DropDown
          options={restaurants}
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
        <Label htmlFor={key}>{keyMapping[key] || key}</Label>
        <Input
          name={key}
          type="number"
          onChange={(e) => {
            const { name, value } = e.target
            setFormData((prevFormData) => ({
              ...prevFormData,
              [name]: parseFloat(value),
            }))
          }}
          step={key === "rating" ? "0.1" : key === "price" ? "0.01" : "1"}
          min={key === "price" ? "1" : "0"}
          max={key === "rating" ? "5" : undefined}
          required
        />
      </div>
    ) : (
      <div key={key}>
        <Label htmlFor={key}>{keyMapping[key] || key}</Label>
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

  console.log(formData)

  return (
    <div className="pt-10">
      <h2>
        Add{" "}
        {tableName &&
          tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase()}
      </h2>

      <div className="flex flex-col gap-4">
        {/* images */}
        <div className="flex flex-col gap-4">
          {fullWidthKeys.map((key) =>
            key === "image" ? (
              <div key="image">
                <Label htmlFor="image">Upload Image</Label>
                <div className="flex items-center gap-4">
                  <Label htmlFor="image">
                    <img
                      src={image ? URL.createObjectURL(image) : UploadAreaImg}
                      alt="Upload Area Image"
                      className="w-32 cursor-pointer"
                    />
                  </Label>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setImage(false)}
                  >
                    <img src={TrashIcon} alt="Trash Icon" className="h-4 w-4" />
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
            ) : (
              key === "images" && (
                <div key="images">
                  <Label htmlFor="images">Upload Images</Label>

                  <Label
                    htmlFor="images"
                    className="flex cursor-pointer flex-wrap items-center gap-3"
                  >
                    {images.length > 0 ? (
                      images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(img)}
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
                  </Label>

                  <input
                    type="file"
                    name="images"
                    id="images"
                    hidden
                    multiple
                    required
                    onChange={(e) => {
                      setImages([...images, ...e.target.files]) // Add selected images to state
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        images: [...images, ...e.target.files],
                      }))
                    }}
                  />
                </div>
              )
            )
          )}
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
        <div className="flex flex-col gap-4">
          {fullWidthKeys
            .filter((key) => key !== "image")
            .map((key) =>
              key === "address" ? (
                <div key="address">
                  <Label htmlFor="address">Address</Label>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <Input
                        type="name"
                        placeholder="First Name"
                        name="firstName"
                        onChange={(e) => onChangeHandler(e, setFormData)}
                        required
                      />
                      <Input
                        type="name"
                        placeholder="Last Name"
                        name="lastName"
                        onChange={(e) => onChangeHandler(e, setFormData)}
                        required
                      />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email"
                      name="email"
                      onChange={(e) => onChangeHandler(e, setFormData)}
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Street"
                      name="street"
                      onChange={(e) => onChangeHandler(e, setFormData)}
                      required
                    />
                    <div className="flex gap-4">
                      <Input
                        type="text"
                        placeholder="City"
                        name="city"
                        onChange={(e) => onChangeHandler(e, setFormData)}
                        required
                      />
                      <Input
                        type="text"
                        placeholder="State"
                        name="state"
                        onChange={(e) => onChangeHandler(e, setFormData)}
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <Input
                        type="text"
                        placeholder="Zip Code"
                        name="zipcode"
                        onChange={(e) => onChangeHandler(e, setFormData)}
                        required
                      />
                      <Input
                        type="text"
                        placeholder="Country"
                        name="country"
                        onChange={(e) => onChangeHandler(e, setFormData)}
                        required
                      />
                    </div>
                    <Input
                      type="phone"
                      placeholder="Phone"
                      name="phone"
                      onChange={(e) => onChangeHandler(e, setFormData)}
                      required
                    />
                  </div>
                </div>
              ) : key === "streetAddress" ? (
                <div key="streetAddress">
                  <Label htmlFor="address">Address</Label>
                  <div className="flex flex-col gap-4">
                    <Input
                      type="text"
                      placeholder="Street"
                      name="street"
                      onChange={(e) => onChangeHandler(e, setFormData)}
                      required
                    />
                    <div className="flex gap-4">
                      <Input
                        type="text"
                        placeholder="City"
                        name="city"
                        onChange={(e) => onChangeHandler(e, setFormData)}
                        required
                      />
                      <Input
                        type="text"
                        placeholder="State"
                        name="state"
                        onChange={(e) => onChangeHandler(e, setFormData)}
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <Input
                        type="text"
                        placeholder="Zip Code"
                        name="zipcode"
                        onChange={(e) => onChangeHandler(e, setFormData)}
                        required
                      />
                      <Input
                        type="text"
                        placeholder="Country"
                        name="country"
                        onChange={(e) => onChangeHandler(e, setFormData)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : key === "items" ? (
                <div key="items">
                  <div className="flex justify-between">
                    <Label htmlFor="item">Menu Items</Label>
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
                        <div key={index} className="flex gap-3 py-3">
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
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              min={1}
                              required
                            />
                          </div>
                          {selectedDish?.price > 0 && (
                            <div className="flex flex-col items-center justify-center">
                              {/* SubTotal */}
                              <Label htmlFor="subtotal">Subtotal</Label>
                              <p className="mt-1">${subtotal}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              ) : key === "deliveryType" ? (
                <div key="deliveryType">
                  <Label htmlFor="deliveryType">Delivery Type</Label>
                  <DropDown
                    options={deliveryType}
                    defaultValue={deliveryType[0].label}
                    onChange={(type) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        deliveryType: type,
                      }))
                    }}
                  />
                </div>
              ) : (
                key === "description" && (
                  <div key="description">
                    <Label htmlFor="description">Description</Label>
                    <TextArea
                      placeholder=""
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

        <div className="flex justify-end">
          <Button onClick={(e) => handleSubmit(e)}>Add</Button>
        </div>
      </div>
    </div>
  )
}

export default AddForm
