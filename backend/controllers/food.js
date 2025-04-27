import fs from "fs"

import dishModel from "../models/food.js"

// add dish item
const addDish = async (req, res) => {
  const { name, description, price, category, rating } = req.body
  const { filename } = req.file
  if (!name || !description || !price || !category || !rating || !filename) {
    return res.json({
      error: "Missing required fields.",
      required: ["name", "description", "price", "category", "rating"],
    })
  }

  const food = new dishModel({
    name: name,
    description: description,
    price: price,
    category: category,
    rating: rating,
    image: `${filename}`,
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
  if (!dishID) {
    return res.json({ success: false, message: "Missing dish's ID field!" })
  }

  try {
    const dish = await dishModel.findById(dishID)
    if (!dish) {
      res.json({ success: false, message: "Dish not found!" })
      return
    }
    fs.unlink(`uploads/${dish.image}`, () => {})
    const deleteDish = await dishModel.findByIdAndDelete(dishID)
    if (!deleteDish) {
      res.json({ success: false, message: "Error in removing the dish!" })
      return
    }
    res.json({ success: true, message: "Dish Removed" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in removing dish: ${err}` })
  }
}

// update dish item
const updateDish = async (req, res) => {
  const { dishID } = req.params
  const { name, description, price, category, rating } = req.body
  if (!dishID || !name || !description || !price || !category || !rating) {
    return res.json({
      error: "Missing required fields.",
      required: [
        "dishID",
        "name",
        "description",
        "price",
        "category",
        "rating",
      ],
    })
  }

  try {
    const dish = await dishModel.findById(dishID)
    if (!dish) {
      return res.json({ success: false, message: "Dish not found!" })
    }

    let updatedData = {
      name: name || dish.name,
      description: description || dish.description,
      price: price || dish.price,
      category: category || dish.category,
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
  if (!dishID) {
    return res.json({ success: false, message: "Missing dishID field!" })
  }

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
