import fs from "fs"

import categoryModel from "../models/category.js"
import cuisineModel from "../models/cuisine.js"
import dishModel from "../models/dish.js"
import orderModel from "../models/order.js"
import restaurantModel from "../models/restaurant.js"
import { checkMissingFields } from "../validationUtils.js"

const addDish = async (req, res) => {
  const { filename } = req.file || {}

  let missingFieldsResponse = checkMissingFields("dish", req.body, [
    "name",
    "description",
    "price",
    "categoryID",
    "rating",
    "cuisineIDs",
    "servingSize",
    "ingredients",
    "calories",
    "protein",
    "fat",
    "carbs",
  ])
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
    const dish = new dishModel({
      ...req.body,
      image: filename,
    })

    await dish.save()

    await Promise.all([
      categoryModel.findByIdAndUpdate(dish.categoryID, {
        $addToSet: { dishIDs: dish._id },
      }),

      ...dish.cuisineIDs.map((cuisineID) =>
        cuisineModel.findByIdAndUpdate(cuisineID, {
          $addToSet: { dishIDs: dish._id },
        })
      ),

      restaurantModel.findByIdAndUpdate(dish.restaurantID, {
        $addToSet: { dishIDs: dish._id },
      }),
    ])

    res.json({ success: true, message: "Dish Added and Linked!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in adding dish: ${err}` })
  }
}

const listDishes = async (req, res) => {
  try {
    const dishes = await dishModel.find({}).sort({ createdAt: -1 })
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
  const {
    name,
    description,
    price,
    categoryID,
    rating,
    cuisineIDs,
    restaurantID,
    servingSize,
    ingredients,
    calories,
    protein,
    fat,
    carbs,
    allergens,
  } = req.body
  const { filename } = req.file || {}

  let missingFieldsResponse = checkMissingFields("dish", req.body, [
    "name",
    "description",
    "price",
    "categoryID",
    "rating",
    "cuisineIDs",
    "restaurantID",
    "servingSize",
    "ingredients",
    "calories",
    "protein",
    "fat",
    "carbs",
    "allergens",
  ])
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  try {
    const dish = await dishModel.findById(dishID)
    if (!dish) return res.json({ success: false, message: "Dish not found!" })

    const previousCuisineIDs = dish.cuisineIDs
    const previousRestaurantID = dish.restaurantID
    const previousCategoryID = dish.previousCategoryID
    let updatedData = {
      name: name || dish.name,
      description: description || dish.description,
      price: price || dish.price,
      categoryID: categoryID || dish.categoryID,
      rating: rating || dish.rating,
      cuisineIDs: cuisineIDs || dish.cuisineIDs,
      restaurantID: restaurantID || dish.restaurantID,
      servingSize: servingSize || dish.servingSize,
      ingredients: ingredients || dish.ingredients,
      calories: calories || dish.calories,
      protein: protein || dish.protein,
      fat: fat || dish.fat,
      carbs: carbs || dish.carbs,
      allergens: allergens || dish.allergens,
    }

    if (req.file) {
      const image_filename = filename
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
          $addToSet: { dishIDs: dishID }, // Add new dishID to array
        })
      ),

      previousRestaurantID &&
        restaurantModel.findByIdAndUpdate(previousRestaurantID, {
          $pull: { dishIDs: dishID }, // Remove restaurantID
        }),

      restaurantID &&
        restaurantModel.findByIdAndUpdate(restaurantID, {
          $addToSet: { dishIDs: dishID }, // Update new restaurantID
        }),

      previousCategoryID &&
        categoryModel.findByIdAndUpdate(previousCategoryID, {
          $pull: { dishIDs: dishID }, // Remove dishID from previous category
        }),
      categoryID &&
        categoryModel.findByIdAndUpdate(categoryID, {
          $addToSet: { dishIDs: dishID }, // Add dishID to new category
        }),
    ])

    res.json({
      success: true,
      message: "Dish, cuisines, and restaurants updated!",
    })
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
    res.json({ success: false, message: `Error in fetching dish: ${err}` })
  }
}

export { getDish, addDish, listDishes, removeDish, updateDish }
