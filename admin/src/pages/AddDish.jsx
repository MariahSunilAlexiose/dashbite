import React, { useState } from "react"

import { Button, DropDown, Input, Label, TextArea } from "@cmp"
import { UploadAreaImg } from "@img"
import { useToast } from "@providers"
import axios from "axios"

import { backendURL, categories } from "@/constants"

const AddDish = () => {
  const [formData, setFormData] = useState({})
  const [image, setImage] = useState(false)
  const { addToast } = useToast()
  console.log(formData)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${backendURL}/dish/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      addToast("success", "Success", "Food Added")
      setFormData({})
      setImage(false)
    } catch (err) {
      console.error("Error in adding:", err)
      addToast("error", "Error", "Error in adding dish")
    }
  }
  return (
    <div>
      <h2>Add Dish</h2>
      <div className="flex flex-col gap-3">
        <div>
          <Label>Upload Image</Label>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : UploadAreaImg}
              alt="Upload Area Image"
              className="w-32 cursor-pointer"
            />
          </label>
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
        <div className="flex justify-items-stretch gap-3">
          <div className="flex-1">
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

          <div className="flex-1">
            <Label>Food Name</Label>
            <Input
              name="name"
              type="text"
              value={formData.name || ""}
              onChange={(e) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  name: e.target.value,
                }))
              }}
            />
          </div>
        </div>

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
        <div className="flex justify-items-stretch gap-3">
          <div className="flex-1">
            <Label>Price</Label>
            <Input
              name="price"
              type="number"
              value={formData.price || ""}
              onChange={(e) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  price: Number(e.target.value),
                }))
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="flex-1">
            <Label>Rating</Label>
            <Input
              name="rating"
              type="number"
              value={formData.rating || ""}
              onChange={(e) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  rating: Number(e.target.value),
                }))
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              step="1"
              min="0"
              max="5"
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Add Dish</Button>
        </div>
      </div>
    </div>
  )
}

export default AddDish
