import fs from "fs"

import categoryModel from "../models/category.js"
import foodModel from "../models/food.js"
import { checkMissingFields } from "../validationUtils.js"

const addCategory = async (req, res) => {
  const { name } = req.body
  const { filename } = req.file || {}
  let missingFieldsResponse = checkMissingFields("order", req.body, ["name"])
  if (!filename) {
    if (!missingFieldsResponse)
      missingFieldsResponse = {
        success: false,
        message: "Missing required field: image",
      }
    else missingFieldsResponse.message += ", image"
  }
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  try {
    const category = new categoryModel({ name, image: filename })
    await category.save()
    res.json({ success: true, message: "Category Added!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in adding category: ${err}` })
  }
}

const updateCategory = async (req, res) => {
  const { categoryID } = req.params
  const { name } = req.body
  const { filename } = req.file || {}

  let missingFieldsResponse = checkMissingFields("category", req.body, ["name"])
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  try {
    const category = await categoryModel.findById(categoryID)
    if (!category)
      return res.json({ success: false, message: "Category not found!" })

    let updatedData = {
      name: name || category.name,
    }

    if (req.file) {
      const image_filename = `${filename}`
      updatedData.image = image_filename

      // Remove the old image file if it exists
      if (category.image) {
        fs.unlink(`uploads/${category.image}`, (err) => {
          if (err)
            res.json({
              success: false,
              message: `Error removing old image: ${err}`,
            })
        })
      }
    }

    const newCategory = await categoryModel.findByIdAndUpdate(
      categoryID,
      updatedData,
      { new: true }
    )
    if (!newCategory)
      return res.json({
        success: false,
        message: "Error in updating category!",
      })
    res.json({ success: true, message: "Category updated!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in updating category: ${err}` })
  }
}

const deleteCategory = async (req, res) => {
  const { categoryID } = req.params

  try {
    const category = await categoryModel.findById(categoryID)
    if (!category)
      return res.json({ success: false, message: "Category not found!" })

    const dishOrders = await foodModel.find({ categoryID: categoryID })
    if (dishOrders.length > 0)
      return res.json({
        success: false,
        message: "Category is present in dishes and cannot be deleted!",
      })

    fs.unlink(`uploads/${category.image}`, () => {})

    const deletedCategory = await categoryModel.findByIdAndDelete(categoryID)
    if (!deletedCategory)
      return res.json({
        success: false,
        message: "Error in deleting category!",
      })
    res.json({ success: true, message: "Category Deleted!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in deleting category: ${err}` })
  }
}

const getCategory = async (req, res) => {
  const { categoryID } = req.params

  try {
    const category = await categoryModel.findById(categoryID)
    if (!category)
      return res.json({
        success: false,
        message: "Category not found!",
      })
    res.json({ success: true, data: category })
  } catch (err) {
    console.error(err)
    res.json({
      success: false,
      message: `Error in retrieving category: ${err}`,
    })
  }
}

const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({}).sort({ createdAt: -1 })
    res.json({ success: true, data: categories })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      success: false,
      message: `Error in retrieving categories: ${err.message}`,
    })
  }
}

const getCategoryDishes = async (req, res) => {
  const { categoryID } = req.params

  try {
    const dishes = await foodModel.find({ categoryID })

    if (!dishes.length)
      return res.json({
        success: false,
        message: "No dishes found for this category!",
      })

    res.json({ success: true, data: dishes })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error retrieving dishes: ${err}` })
  }
}

export {
  getCategoryDishes,
  addCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategories,
}
