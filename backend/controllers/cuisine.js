import fs from "fs"

import cuisineModel from "../models/cuisine.js"
import dishModel from "../models/dish.js"
import { checkMissingFields } from "../validationUtils.js"

const addCuisine = async (req, res) => {
  const { name } = req.body
  const { filename } = req.file || {}

  let missingFieldsResponse = checkMissingFields("cuisine", req.body, ["name"])
  if (!filename) {
    if (!missingFieldsResponse)
      missingFieldsResponse = {
        success: false,
        message: "Missing required field: image",
      }
    else missingFieldsResponse.message += " image"
  }
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  try {
    const cuisine = new cuisineModel({
      name,
      image: filename,
    })
    await cuisine.save()
    res.json({ success: true, message: "Cuisine Added!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in adding cuisine: ${err}` })
  }
}

const updateCuisine = async (req, res) => {
  const { cuisineID } = req.params
  const { name } = req.body
  const { filename } = req.file || {}

  let missingFieldsResponse = checkMissingFields("cuisine", req.body, ["name"])
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  try {
    const cuisine = await cuisineModel.findById(cuisineID)
    if (!cuisine)
      return res.json({ success: false, message: "Cuisine not found!" })

    let updatedData = { name: name || cuisine.name }

    if (req.file) {
      updatedData.image = filename

      if (cuisine.image) {
        fs.unlink(`uploads/${cuisine.image}`, (err) => {
          if (err) console.error(`Error removing old image: ${err}`)
        })
      }
    }

    await cuisineModel.findByIdAndUpdate(cuisineID, updatedData, { new: true })
    res.json({ success: true, message: "Cuisine updated!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in updating cuisine: ${err}` })
  }
}

const deleteCuisine = async (req, res) => {
  const { cuisineID } = req.params

  try {
    const cuisine = await cuisineModel.findById(cuisineID)
    if (!cuisine)
      return res.json({ success: false, message: "Cuisine not found!" })

    const cuisineDishes = await dishModel.find({ cuisineID })
    if (cuisineDishes.length > 0) {
      return res.json({
        success: false,
        message: "Cuisine is linked to dishes and cannot be deleted!",
      })
    }

    fs.unlink(`uploads/${cuisine.image}`, () => {})

    await cuisineModel.findByIdAndDelete(cuisineID)
    res.json({ success: true, message: "Cuisine Deleted!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in deleting cuisine: ${err}` })
  }
}

const getCuisine = async (req, res) => {
  const { cuisineID } = req.params

  try {
    const cuisine = await cuisineModel.findById(cuisineID)
    if (!cuisine)
      return res.json({ success: false, message: "Cuisine not found!" })
    res.json({ success: true, data: cuisine })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error retrieving cuisine: ${err}` })
  }
}

const getCuisines = async (req, res) => {
  try {
    const cuisines = await cuisineModel.find({}).sort({ createdAt: -1 })
    res.json({ success: true, data: cuisines })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      success: false,
      message: `Error retrieving cuisines: ${err.message}`,
    })
  }
}

const getCuisineDishes = async (req, res) => {
  const { cuisineID } = req.params

  try {
    const cuisine = await cuisineModel.findById(cuisineID)
    if (!cuisine)
      return res.json({ success: false, message: "Cuisine not found!" })

    const dishes = await dishModel.find({ _id: { $in: cuisine.dishIDs } })
    if (!dishes.length)
      return res.json({
        success: false,
        message: "No dishes found for this cuisine!",
      })

    res.json({ success: true, data: dishes })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error retrieving dishes: ${err}` })
  }
}

const addCuisineDishes = async (req, res) => {
  const { cuisineID } = req.params
  const { dishIDs } = req.body

  if (!Array.isArray(dishIDs) || dishIDs.length === 0)
    return res.json({
      success: false,
      message: "Invalid or empty dishIDs array!",
    })

  try {
    const cuisine = await cuisineModel.findById(cuisineID)
    if (!cuisine)
      return res.json({ success: false, message: "Cuisine not found!" })

    const uniqueDishIDs = dishIDs.filter((id) => !cuisine.dishIDs.includes(id)) // Avoid duplicates in cuisine's dish list
    cuisine.dishIDs.push(...uniqueDishIDs)
    await cuisine.save()

    // Update each dish to include the cuisineID
    await dishModel.updateMany(
      { _id: { $in: uniqueDishIDs } },
      { $addToSet: { cuisineIDs: cuisineID } } // prevent duplicates in array
    )

    res.json({
      success: true,
      message: "Dishes successfully added to cuisine and updated!",
    })
  } catch (err) {
    console.error(err)
    res.json({
      success: false,
      message: `Error adding dishes to cuisine: ${err}`,
    })
  }
}

const deleteCuisineDishes = async (req, res) => {
  const { cuisineID, dishID } = req.params

  try {
    const cuisine = await cuisineModel.findById(cuisineID)
    if (!cuisine)
      return res.json({ success: false, message: "Cuisine not found!" })

    cuisine.dishIDs = cuisine.dishIDs.filter((id) => id.toString() !== dishID) // Remove the dish reference
    await cuisine.save()

    const dish = await dishModel.findById(dishID)
    if (!dish) return res.json({ success: false, message: "Dish not found!" })

    dish.cuisineIDs = dish.cuisineIDs.filter(
      (id) => id.toString() !== cuisineID
    ) // Remove cuisine reference from the dish document
    await dish.save()
    res.json({
      success: true,
      message:
        "Dish removed from cuisine and cuisine reference removed from dish!",
    })
  } catch (err) {
    console.error(err)
    res.json({
      success: false,
      message: `Error removing dish from cuisine: ${err}`,
    })
  }
}

export {
  addCuisine,
  updateCuisine,
  deleteCuisine,
  getCuisine,
  getCuisines,
  getCuisineDishes,
  addCuisineDishes,
  deleteCuisineDishes,
}
