import React, { useContext, useEffect, useState } from "react"

import { Button, Input, InputDropDown, Label, Modal, TextArea } from "@cmp"
import { dark, StoreContext, ThemeContext } from "@context"
import { TrashWhiteIcon } from "@icons"
import { UploadAreaDarkImg, UploadAreaImg } from "@img"
import PropTypes from "prop-types"

import { fetchEndpoint, formatDate } from "@/constants"

import { TableCell, TableHead, TableRow } from "./Table"

const ReviewsTable = ({
  title,
  reviews,
  modalOpen,
  formData,
  setFormData,
  setModalOpen,
  handleSave,
  handleDelete,
}) => {
  const { theme } = useContext(ThemeContext)
  const { url } = useContext(StoreContext)
  const [images, setImages] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [dishes, setDishes] = useState([])

  const fetchData = async () => {
    // get restaurants
    const restaurantData = await fetchEndpoint(url, "restaurant")
    setRestaurants(restaurantData)

    // get dishes
    const dishesData = await fetchEndpoint(url, "dish")
    setDishes(dishesData)
  }

  useEffect(() => {
    fetchData()
  }, [restaurants, dishes])

  return (
    <div>
      <div className="w-full">
        <h4>{title}</h4>
        <div>
          {reviews?.length > 0 ? (
            <div className="relative w-full overflow-x-auto p-4">
              <table className="w-full table-auto border-collapse text-sm">
                <thead>
                  <TableRow className="border-b">
                    <TableHead>Date</TableHead>
                    <TableHead>
                      {title == "Restaurant Reviews" ? "Restaurant" : "Dish"}
                    </TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <TableRow
                      key={review._id}
                      className="cursor-pointer border-b"
                      onClick={() => {
                        setModalOpen(true)
                        setFormData(review)
                        setImages(review.images)
                      }}
                    >
                      <TableCell>{formatDate(review.updatedAt)}</TableCell>
                      <TableCell>{review.itemDetails.name}</TableCell>
                      <TableCell>{review.rating}</TableCell>
                      <TableCell>{review.title}</TableCell>
                      <TableCell>{review.comment}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          {review.images?.map((image) => (
                            <div key={image} className="relative h-8 w-8">
                              <img
                                src={`${url}/images/${image}`}
                                alt={review.restaurantID}
                                className="h-full w-full rounded"
                              />
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>You have no reviews yet</p>
          )}
        </div>
      </div>
      {modalOpen && (
        <Modal
          title={
            title == "Restaurant Reviews"
              ? "Edit Your Restaurant Review"
              : "Edit Your Dish Review"
          }
          onClose={() => setModalOpen(false)}
        >
          <div className="flex flex-col gap-4">
            {formData &&
              Object.keys(formData)
                .filter(
                  (field) =>
                    ![
                      "userID",
                      "createdAt",
                      "updatedAt",
                      "_id",
                      "__v",
                      "itemDetails",
                    ].includes(field)
                )
                .map((field) => (
                  <div key={field}>
                    {field == "images" ? (
                      <div key="images">
                        <Label htmlFor="images">Upload Images</Label>

                        <label
                          htmlFor="images"
                          className="flex cursor-pointer flex-wrap items-center gap-3"
                        >
                          {images?.length > 0 ? (
                            images.map((img, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={
                                    img instanceof File
                                      ? URL.createObjectURL(img)
                                      : `${url}/images/${img}`
                                  }
                                  alt={`Uploaded Image ${index + 1}`}
                                  className="h-24 w-24"
                                />

                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() =>
                                    setImages(
                                      images.filter((_, i) => i !== index)
                                    )
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
                              src={
                                theme === dark
                                  ? UploadAreaDarkImg
                                  : UploadAreaImg
                              }
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
                              const updatedImages = [
                                ...prevImages,
                                ...e.target.files,
                              ]

                              setFormData((prevFormData) => ({
                                ...prevFormData,
                                images: updatedImages,
                              }))

                              return updatedImages
                            })
                          }}
                        />
                      </div>
                    ) : field === "restaurantID" || field === "dishID" ? (
                      <div key={field}>
                        <Label htmlFor={field}>
                          {field === "restaurantID" ? "Restaurant" : "Dish"}
                        </Label>
                        <InputDropDown
                          options={
                            field === "restaurantID" ? restaurants : dishes
                          }
                          defaultValue={
                            field === "restaurantID"
                              ? formData?.restaurantID
                              : formData?.dishID
                          }
                          onChange={(id) => {
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              [field]: id,
                            }))
                          }}
                        />
                      </div>
                    ) : field === "comment" ? (
                      <div key="comment">
                        <Label htmlFor="comment">Comment</Label>
                        <TextArea
                          value={formData.comment || ""}
                          onChange={(e) => {
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              comment: e.target.value,
                            }))
                          }}
                        />
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor={field}>
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </Label>
                        <Input
                          key={field}
                          type={field === "rating" ? "number" : "text"}
                          name={field}
                          placeholder={
                            field.charAt(0).toUpperCase() + field.slice(1)
                          }
                          value={formData[field] || ""}
                          onChange={(e) => {
                            const { value } = e.target
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              [field]:
                                field === "rating" ? parseFloat(value) : value,
                            }))
                          }}
                          className="rounded border px-2 py-1"
                          required
                        />
                      </div>
                    )}
                  </div>
                ))}
            <div className="flex gap-5">
              <Button variant="primary" onClick={() => handleSave()}>
                Save
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(formData)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

ReviewsTable.propTypes = {
  title: PropTypes.string.isRequired,
  reviews: PropTypes.arrayOf(PropTypes.object).isRequired,
  modalOpen: PropTypes.boolean,
  setModalOpen: PropTypes.func,
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  handleSave: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

export default ReviewsTable
