import fs from "fs"

import cuisineModel from "../models/cuisine.js"
import dishModel from "../models/dish.js"
import restaurantModel from "../models/restaurant.js"
import { checkMissingFields } from "../validationUtils.js"

const addRestaurant = async (req, res) => {
  const {
    name,
    address,
    phone,
    email,
    cuisineIDs,
    website,
    openingHours,
    rating,
  } = req.body

  const filenames = req.files["images[]"]
    ? req.files["images[]"].map((file) => file.filename)
    : []

  let missingFieldsResponse = checkMissingFields("restaurant", req.body, [
    "name",
    "phone",
    "email",
    "openingHours",
  ])

  if (filenames.length === 0) {
    missingFieldsResponse = missingFieldsResponse || {
      success: false,
      message: "Missing required field: images",
    }
  } else if (filenames.length > 10) {
    missingFieldsResponse = missingFieldsResponse || {
      success: false,
      message: "Exceeded the allowed limit of 10 images!",
    }
  }

  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  try {
    const restaurant = new restaurantModel({
      name,
      address,
      phone,
      email,
      cuisineIDs,
      website,
      openingHours,
      rating,
      images: filenames,
    })

    const savedRestaurant = await restaurant.save()

    if (!savedRestaurant._id)
      return res.json({ success: false, message: "Restaurant ID is missing!" })

    if (cuisineIDs && cuisineIDs.length > 0) {
      await Promise.all(
        cuisineIDs.map(async (cuisineID) => {
          const cuisine = await cuisineModel.findById(cuisineID)
          if (cuisine && !cuisine.restaurantIDs.includes(savedRestaurant._id)) {
            await cuisineModel.findByIdAndUpdate(
              cuisineID,
              {
                $addToSet: { restaurantIDs: savedRestaurant._id },
              },
              { new: true }
            )
          }
        })
      )
    }

    res.json({
      success: true,
      message: "Restaurant added and cuisines updated!",
    })
  } catch (err) {
    console.error("Error in adding restaurant:", err)
    res.json({ success: false, message: `Error in adding restaurant: ${err}` })
  }
}

const updateRestaurant = async (req, res) => {
  const { restaurantID } = req.params
  const {
    name,
    address,
    phone,
    email,
    cuisineIDs,
    website,
    openingHours,
    rating,
    dishIDs,
  } = req.body
  const filenames = req.files ? req.files.map((file) => file.filename) : []

  try {
    const restaurant = await restaurantModel.findById(restaurantID)
    if (!restaurant)
      return res.json({ success: false, message: "Restaurant not found!" })

    const previousCuisineIDs = restaurant.cuisineIDs
    const previousDishIDs = restaurant.dishIDs

    let updatedData = {
      name: name || restaurant.name,
      address: address || restaurant.address,
      phone: phone || restaurant.phone,
      email: email || restaurant.email,
      cuisineIDs: cuisineIDs || restaurant.cuisineIDs,
      website: website || restaurant.website,
      openingHours: openingHours || restaurant.openingHours,
      rating: rating || restaurant.rating,
      dishIDs: dishIDs || restaurant.dishIDs,
      images: filenames.length > 0 ? filenames : restaurant.images,
    }

    if (filenames.length > 0)
      restaurant.images.forEach((image) =>
        fs.unlink(`uploads/${image}`, () => {})
      )

    const updatedRestaurant = await restaurantModel.findByIdAndUpdate(
      restaurantID,
      updatedData,
      { new: true }
    )
    if (!updatedRestaurant)
      return res.json({
        success: false,
        message: "Error in updating restaurant!",
      })

    if (cuisineIDs && cuisineIDs.length > 0) {
      await Promise.all([
        ...previousCuisineIDs.map((cuisineID) =>
          cuisineModel.findByIdAndUpdate(
            cuisineID,
            { $pull: { restaurantIDs: restaurantID } },
            { new: true }
          )
        ),
        ...cuisineIDs.map((cuisineID) => {
          return cuisineModel.findByIdAndUpdate(
            cuisineID,
            {
              $addToSet: { restaurantIDs: restaurantID },
            },
            { new: true }
          )
        }),
      ])
    }

    if (dishIDs && dishIDs.length > 0) {
      await Promise.all([
        ...previousDishIDs.map((dishID) =>
          dishModel.findByIdAndUpdate(
            dishID,
            { $pull: { restaurantIDs: restaurantID } },
            { new: true }
          )
        ),
        ...dishIDs.map((dishID) => {
          return dishModel.findByIdAndUpdate(
            dishID,
            {
              $addToSet: { restaurantIDs: restaurantID },
            },
            { new: true }
          )
        }),
      ])
    }

    res.json({
      success: true,
      message: "Restaurant, cuisines, and dishes updated!",
    })
  } catch (err) {
    console.error("Error updating restaurant:", err)
    res.json({
      success: false,
      message: `Error in updating restaurant: ${err.message}`,
    })
  }
}

const deleteRestaurant = async (req, res) => {
  const { restaurantID } = req.params

  try {
    const restaurant = await restaurantModel.findById(restaurantID)
    if (!restaurant)
      return res.json({ success: false, message: "Restaurant not found!" })

    if (restaurant.dishIDs.length > 0)
      return res.json({
        success: false,
        message: "Cannot delete restaurant while dishes are present!",
      })

    restaurant.images.forEach((image) =>
      fs.unlink(`uploads/${image}`, () => {})
    )

    await Promise.all(
      restaurant.cuisineIDs.map((cuisineID) =>
        cuisineModel.findByIdAndUpdate(cuisineID, {
          $pull: { restaurantIDs: restaurantID },
        })
      )
    )

    const deletedRestaurant =
      await restaurantModel.findByIdAndDelete(restaurantID)
    if (!deletedRestaurant)
      return res.json({
        success: false,
        message: "Error in deleting restaurant!",
      })

    res.json({ success: true, message: "Restaurant Deleted!" })
  } catch (err) {
    console.error(err)
    res.json({
      success: false,
      message: `Error in deleting restaurant: ${err}`,
    })
  }
}

const getRestaurant = async (req, res) => {
  const { restaurantID } = req.params

  try {
    const restaurant = await restaurantModel.findById(restaurantID)
    if (!restaurant)
      return res.json({ success: false, message: "Restaurant not found!" })

    res.json({ success: true, data: restaurant })
  } catch (err) {
    console.error(err)
    res.json({
      success: false,
      message: `Error in fetching restaurant: ${err}`,
    })
  }
}

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find({}).sort({ createdAt: -1 })
    res.json({ success: true, data: restaurants })
  } catch (err) {
    console.error(err)
    res.json({
      success: false,
      message: `Error in fetching restaurants: ${err.message}`,
    })
  }
}

export {
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurant,
  getRestaurants,
}
