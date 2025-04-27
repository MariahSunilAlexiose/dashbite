import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Button, DropDown, Input, Label, TextArea } from "@cmp"
import { TrashIcon } from "@icons"
import { UploadAreaImg } from "@img"
import { useToast } from "@providers"
import axios from "axios"

import { backendImgURL, backendURL, categories } from "@/constants"

const UpdateDish = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { dataToBeUpdated } = location.state || {}
  const [formData, setFormData] = useState(dataToBeUpdated)
  const [image, setImage] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const { _id, ...dataToSubmit } = formData
      await axios.put(`${backendURL}/dish/${_id}`, dataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: import.meta.env.VITE_ADMIN_TOKEN,
        },
      })
      navigate(-1)
    } catch (err) {
      console.error(err)
      addToast("error", "Error", `Error in updating the dish: ${err}`)
    }
  }
  return (
    <div>
      <h2>Update Dish</h2>
      <div className="flex flex-col gap-3">
        <div>
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
          <Button onClick={handleSubmit}>Update Dish</Button>
        </div>
      </div>
    </div>
  )
}

export default UpdateDish
