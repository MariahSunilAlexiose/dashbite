import React, { useContext, useState } from "react"

import { Button, Input, Label, TextArea } from "@cmp"
import { StoreContext } from "@context"
import {
  GrayStarIcon,
  StarIcon,
  TrashWhiteIcon,
  UserIcon,
  UserWhiteIcon,
} from "@icons"
import { UploadAreaImg } from "@img"
import { useTheme, useToast } from "@providers"
import axios from "axios"
import PropTypes from "prop-types"

import { formatDate, getRatingImage } from "@/constants"

const Reviews = ({ reviews, page, pageID }) => {
  const { theme } = useTheme()
  const { addToast } = useToast()
  const { url, token } = useContext(StoreContext)

  const [images, setImages] = useState([])
  const [formData, setFormData] = useState({
    [`${page}ID`]: pageID,
  })
  const [rating, setRating] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${url}/api/review`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
        },
      })
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }
      // window.location.reload()
      addToast("success", "Success", "Added Review!")
      setFormData({})
    } catch (err) {
      console.error(err)
      addToast("error", "Error", "Failed to add review!")
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-2 pt-5">
        <h3>Add Your Review</h3>

        {/* Give a rating */}
        <div className="flex items-center gap-2">
          <Label htmlFor="rating">Rate your experience: </Label>
          <div className="flex">
            {[...Array(5)].map((_, index) => {
              const currentRate = index + 1
              return (
                <label key={currentRate} className="flex cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    className="hidden"
                    value={currentRate}
                    onClick={() => setRating(currentRate)}
                    onChange={(e) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        rating: e.target.value,
                      }))
                    }}
                  />
                  <img
                    src={currentRate <= rating ? StarIcon : GrayStarIcon}
                    alt="Star Icon"
                    className="h-4 w-4"
                  />
                </label>
              )
            })}
          </div>
        </div>

        {/* Title Text Box */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            name="title"
            type="text"
            placeholder="Sum up your dining experience in a few words!"
            onChange={(e) => {
              setFormData((prevFormData) => ({
                ...prevFormData,
                title: e.target.value,
              }))
            }}
          />
        </div>

        {/* Review Text Box */}
        <div>
          <Label htmlFor="description">Review</Label>
          <TextArea
            placeholder="Share your thoughts on the food, service, and atmosphere. How was the ambiance and food quality? Would you recommend it? What made your visit memorable, and any must-try dishes?"
            onChange={(e) => {
              setFormData((prevFormData) => ({
                ...prevFormData,
                comment: e.target.value,
              }))
            }}
          />
        </div>

        {/* Upload Image Box */}
        <div key="images">
          <Label htmlFor="images">Add Photos</Label>

          <Label
            htmlFor="images"
            className="flex cursor-pointer flex-wrap items-center gap-3"
          >
            {images.length > 0 ? (
              images.map((img, index) => (
                <div key={img} className="relative">
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
                      src={TrashWhiteIcon}
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

        {/* Add Button */}
        <div className="flex justify-end">
          <Button onClick={(e) => handleSubmit(e)}>Add Review</Button>
        </div>
      </div>

      {/* Reviews */}
      {reviews.map((review, index) => (
        <div
          key={review._id}
          className={`border-border border-b p-3 ${index === 0 ? "mt-5 border-t" : ""}`}
        >
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full">
                <img
                  src={
                    review.user?.profilePic
                      ? review.user.profilePic.startsWith(
                          "https://ui-avatars.com/api/?name="
                        )
                        ? review.user.profilePic
                        : `${url}/api/${review.user.profilePic}`
                      : theme === "dark"
                        ? UserWhiteIcon
                        : UserIcon
                  }
                  alt="User Profile"
                  className="aspect-square h-full w-full object-cover"
                />
              </div>
              <h4>{review.user?.name}</h4>
            </div>
            <p className="m-0 text-sm">{formatDate(review.updatedAt)}</p>
          </div>
          <div className="pt-5">
            <div className="flex items-center gap-3">
              <h5 className="font-bold">{review.title}</h5>
              <img
                src={getRatingImage(review.rating)}
                alt="Rating Icon"
                className="h-4 w-20"
              />
            </div>
            <p className="m-0">{review.comment}</p>
            {review.images && (
              <div className="flex gap-2">
                {review.images.map((image) => (
                  <img
                    key={image}
                    src={`${url}/images/${image}`}
                    alt="Restaurant Image"
                    className="h-20 w-20"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

Reviews.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.string).isRequired,
  page: PropTypes.string.isRequired,
  pageID: PropTypes.string.isRequired,
}

export default Reviews
