import fs from "fs"

import dishModel from "../models/food.js"
import orderModel from "../models/order.js"
import { checkMissingFields } from "../validationUtils.js"

// add dish item
const addDish = async (req, res) => {
  const { name, description, price, categoryID, rating } = req.body
  const { filename } = req.file || {}

  // Check missing fields
  let missingFieldsResponse = checkMissingFields("dish", req.body, [
    "name",
    "description",
    "price",
    "categoryID",
    "rating",
  ])

  // Ensure missingFieldsResponse exists before modifying it
  if (!filename) {
    if (!missingFieldsResponse) {
      missingFieldsResponse = {
        success: false,
        message: "Missing required field: image",
      }
    } else {
      missingFieldsResponse.message += " image"
    }
  }

  // Return error response if there are missing fields
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  // Proceed with saving dish
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

// list dishes
const listDishes = async (req, res) => {
  try {
    const dishes = await dishModel
      .find({})
      .sort({ createdAt: -1 })
      .select("-createdAt -updatedAt")
    if (!dishes) {
      res.json({ success: false, message: "Dishes not found!" })
      return
    }
    res.json({ success: true, data: dishes })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in listing dishes: ${err}` })
  }
}

// remove dishes
const removeDish = async (req, res) => {
  const { dishID } = req.params

  try {
    const dish = await dishModel.findById(dishID)
    if (!dish) {
      res.json({ success: false, message: "Dish not found!" })
      return
    }

    const dishOrders = await orderModel.find({ "items._id": dishID })
    if (dishOrders.length > 0) {
      res.json({
        success: false,
        message: "Dish is present in orders and cannot be deleted!",
      })
      return
    }
    fs.unlink(`uploads/${dish.image}`, () => {})

    const deletedDish = await dishModel.findByIdAndDelete(dishID)
    if (!deletedDish) {
      res.json({ success: false, message: "Error in deleting the dish!" })
      return
    }

    res.json({ success: true, message: "Dish Removed!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in deleting dish: ${err}` })
  }
}

// update dish item
const updateDish = async (req, res) => {
  const { dishID } = req.params
  const { name, description, price, categoryID, rating } = req.body
  let missingFieldsResponse = checkMissingFields("dish", req.body, [
    "name",
    "description",
    "price",
    "categoryID",
    "rating",
  ])

  // Return error response if there are missing fields
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  try {
    const dish = await dishModel.findById(dishID)
    if (!dish) {
      return res.json({ success: false, message: "Dish not found!" })
    }

    let updatedData = {
      name: name || dish.name,
      description: description || dish.description,
      price: price || dish.price,
      categoryID: categoryID || dish.categoryID,
      rating: rating || dish.rating,
    }

    // Check if an image is uploaded
    if (req.file) {
      const image_filename = `${req.file.filename}`
      updatedData.image = image_filename

      // Remove the old image file if it exists
      if (dish.image) {
        fs.unlink(`uploads/${dish.image}`, (err) => {
          if (err)
            res.json({
              success: false,
              message: `Error removing old image: ${err}`,
            })
        })
      }
    }

    const newDish = await dishModel.findByIdAndUpdate(dishID, updatedData, {
      new: true,
    })
    if (!newDish) {
      return res.json({ success: false, message: "Error in updating dish!" })
    }
    res.json({ success: true, message: "Dish updated!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in updating dish: ${err}` })
  }
}

const getDish = async (req, res) => {
  const { dishID } = req.params
  try {
    const dish = await dishModel.findOne({ _id: dishID })
    if (!dish) {
      return res.json({ success: false, message: "Dish not found!" })
    }
    res.json({ success: true, data: dish })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in retrieving dish: ${err}` })
  }
}

export { getDish, addDish, listDishes, removeDish, updateDish }
