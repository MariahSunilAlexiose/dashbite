import fs from "fs"

import cuisineModel from "../models/cuisine.js"
import dishModel from "../models/food.js"
import orderModel from "../models/order.js"
import { checkMissingFields } from "../validationUtils.js"

const addDish = async (req, res) => {
  const { name, description, price, categoryID, rating } = req.body
  const { filename } = req.file || {}

  let missingFieldsResponse = checkMissingFields("dish", req.body, [
    "name",
    "description",
    "price",
    "categoryID",
    "rating",
  ])
  if (!filename) {
    if (!missingFieldsResponse)
      missingFieldsResponse = {
        success: false,
        message: "Missing required field: image",
      }
    else missingFieldsResponse.message += " image"
  }
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  const food = new dishModel({
    name,
    description,
    price,
    categoryID,
    rating,
    image: filename,
  })

  try {
    await food.save()
    res.json({ success: true, message: "Dish Added" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in adding dish: ${err}` })
  }
}

const listDishes = async (req, res) => {
  try {
    const dishes = await dishModel
      .find({})
      .sort({ createdAt: -1 })
      .select("-createdAt -updatedAt")
    if (!dishes)
      return res.json({ success: false, message: "Dishes not found!" })
    res.json({ success: true, data: dishes })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in listing dishes: ${err}` })
  }
}

const removeDish = async (req, res) => {
  const { dishID } = req.params

  try {
    const dish = await dishModel.findById(dishID)
    if (!dish) return res.json({ success: false, message: "Dish not found!" })
    const dishOrders = await orderModel.find({ "items._id": dishID })
    if (dishOrders.length > 0)
      return res.json({
        success: false,
        message: "Dish is present in orders and cannot be deleted!",
      })

    fs.unlink(`uploads/${dish.image}`, () => {})

    const deletedDish = await dishModel.findByIdAndDelete(dishID)
    if (!deletedDish)
      return res.json({
        success: false,
        message: "Error in deleting the dish!",
      })
    res.json({ success: true, message: "Dish Removed!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in deleting dish: ${err}` })
  }
}

const updateDish = async (req, res) => {
  const { dishID } = req.params
  const { name, description, price, categoryID, rating, cuisineIDs } = req.body

  let missingFieldsResponse = checkMissingFields("dish", req.body, [
    "name",
    "description",
    "price",
    "categoryID",
    "rating",
    "cuisineIDs",
  ])
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  try {
    const dish = await dishModel.findById(dishID)
    if (!dish) return res.json({ success: false, message: "Dish not found!" })

    const previousCuisineIDs = dish.cuisineIDs // Find previous cuisines linked to this dish

    let updatedData = {
      name: name || dish.name,
      description: description || dish.description,
      price: price || dish.price,
      categoryID: categoryID || dish.categoryID,
      rating: rating || dish.rating,
      cuisineIDs: cuisineIDs || dish.cuisineIDs,
    }

    if (req.file) {
      const image_filename = `${req.file.filename}`
      updatedData.image = image_filename

      // Remove the old image file if it exists
      if (dish.image)
        fs.unlink(`uploads/${dish.image}`, (err) => {
          if (err)
            return res.json({
              success: false,
              message: `Error removing old image: ${err}`,
            })
        })
    }

    const newDish = await dishModel.findByIdAndUpdate(dishID, updatedData, {
      new: true,
    })

    if (!newDish)
      return res.json({ success: false, message: "Error in updating dish!" })

    await Promise.all([
      ...previousCuisineIDs.map((cuisineID) =>
        cuisineModel.findByIdAndUpdate(cuisineID, {
          $pull: { dishIDs: dishID }, // Remove dishID from array
        })
      ),

      ...cuisineIDs.map((cuisineID) =>
        cuisineModel.findByIdAndUpdate(cuisineID, {
          $addToSet: { dishIDs: dishID }, // Ensure dishID is added to array
        })
      ),
    ])

    res.json({ success: true, message: "Dish and cuisines updated!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in updating dish: ${err}` })
  }
}

const getDish = async (req, res) => {
  const { dishID } = req.params

  try {
    const dish = await dishModel.findOne({ _id: dishID })
    if (!dish) return res.json({ success: false, message: "Dish not found!" })
    res.json({ success: true, data: dish })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in retrieving dish: ${err}` })
  }
}

export { getDish, addDish, listDishes, removeDish, updateDish }
