import fs from "fs"

import dishModel from "../models/food.js"

// add dish item
const addDish = async (req, res) => {
  let image_filename = `${req.file.filename}`
  const food = new dishModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    rating: req.body.rating,
    image: image_filename,
  })
  try {
    await food.save()
    res.json({ success: true, message: "Dish Added" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" })
  }
}

// list dishes
const listDishes = async (req, res) => {
  try {
    const dishes = await dishModel.find({})
    res.json({ success: true, data: dishes })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" })
  }
}

// remove dishes
const removeDish = async (req, res) => {
  try {
    const dish = await dishModel.findById(req.body.id)
    fs.unlink(`uploads/${dish.image}`, () => {})
    await dishModel.findByIdAndDelete(req.body.id)
    res.json({ success: true, message: "Dish Removed" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" })
  }
}

// update dish item
const updateDish = async (req, res) => {
  try {
    const dish = await dishModel.findById(req.body._id)
    if (!dish) {
      return res.json({ success: false, message: "Dish not found" })
    }

    let updatedData = {
      name: req.body.name || dish.name,
      description: req.body.description || dish.description,
      price: req.body.price || dish.price,
      category: req.body.category || dish.category,
      rating: req.body.rating || dish.rating,
    }

    // Check if an image is uploaded
    if (req.file) {
      const image_filename = `${req.file.filename}`
      updatedData.image = image_filename

      // Remove the old image file if it exists
      if (dish.image) {
        fs.unlink(`uploads/${dish.image}`, (err) => {
          if (err) console.error("Error removing old image:", err)
        })
      }
    }

    await dishModel.findByIdAndUpdate(req.body._id, updatedData, { new: true })
    res.json({ success: true, message: "Dish updated" })
  } catch (error) {
    console.error("Error in updating dish:", error)
    res.json({ success: false, message: "Error" })
  }
}

export { addDish, listDishes, removeDish, updateDish }
