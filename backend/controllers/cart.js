import userModel from "../models/user.js"

// add items to user cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userID)
    let cartData = await userData.cartData
    if (!cartData[req.body.itemID]) {
      cartData[req.body.itemID] = 1
    } else {
      cartData[req.body.itemID] += 1
    }
    await userModel.findByIdAndUpdate(req.body.userID, { cartData })
    res.json({ success: true, message: "Added to Cart!" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error!" })
  }
}

// remove item from user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userID)
    let cartData = await userData.cartData
    if (cartData[req.body.itemID] > 0) {
      cartData[req.body.itemID] -= 1
    } else if (cartData[req.body.itemID] == 0) {
      delete cartData[req.body.itemID]
    }
    await userModel.findByIdAndUpdate(req.body.userID, { cartData })
    res.json({ success: true, message: "Removed from Cart!" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error!" })
  }
}

// deleted item from user cart
const deleteFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userID)
    let cartData = await userData.cartData
    if (cartData[req.body.itemID] >= 0) {
      delete cartData[req.body.itemID]
    }
    await userModel.findByIdAndUpdate(req.body.userID, { cartData })
    res.json({ success: true, message: "Deleted from Cart!" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error!" })
  }
}

// fetch user cart data
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userID)
    let cartData = await userData.cartData
    // Remove items with count 0
    cartData = Object.fromEntries(
      Object.entries(cartData).filter(([key, value]) => value > 0) // eslint-disable-line no-unused-vars
    )
    res.json({ success: true, cartData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error!" })
  }
}

export { addToCart, removeFromCart, deleteFromCart, getCart }
