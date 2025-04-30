import userModel from "../models/user.js"

// add items to user cart
const addToCart = async (req, res) => {
  const { itemID } = req.body
  if (!itemID)
    return res.json({ success: false, message: "ItemID not present!" })

  try {
    const userData = await userModel.findById(req.userID)
    if (!userData) {
      res.json({ success: false, message: "User not found!" })
      return
    }
    let cartData = await userData.cartData
    if (!cartData) {
      res.json({ success: false, message: "Cart not found!" })
      return
    }
    if (!cartData[itemID]) {
      cartData[itemID] = 1
    } else {
      cartData[itemID] += 1
    }
    const cart = await userModel.findByIdAndUpdate(req.userID, { cartData })
    if (!cart) {
      res.json({ success: false, message: "Error in updating cart!" })
      return
    }
    res.json({ success: true, message: "Added to Cart!" })
  } catch (err) {
    res.json({ success: false, message: `Error in adding to cart: ${err}` })
  }
}

// remove item from user cart
const removeFromCart = async (req, res) => {
  const { itemID } = req.body
  if (!itemID)
    return res.json({ success: false, message: "ItemID not present!" })

  try {
    let userData = await userModel.findById(req.userID)
    if (!userData) {
      res.json({ success: false, message: "User not found!" })
      return
    }
    let cartData = await userData.cartData
    if (!userData) {
      res.json({ success: false, message: "Cart not found!" })
      return
    }
    if (cartData[itemID] > 0) cartData[itemID] -= 1
    else if (cartData[itemID] == 0) delete cartData[itemID]
    const cart = await userModel.findByIdAndUpdate(req.userID, { cartData })
    if (!cart) {
      res.json({ success: false, message: "Error in updating cart!" })
      return
    }
    res.json({ success: true, message: "Removed from Cart!" })
  } catch (err) {
    res.json({ success: false, message: `Error in removing from cart: ${err}` })
  }
}

// deleted item from user cart
const deleteFromCart = async (req, res) => {
  const { itemID } = req.body
  if (!itemID)
    return res.json({ success: false, message: "ItemID not present!" })

  try {
    const userData = await userModel.findById(req.userID)
    if (!userData) {
      res.json({ success: false, message: "User not found!" })
      return
    }
    const cartData = await userData.cartData
    if (!cartData) {
      res.json({ success: false, message: "Cart not found!" })
      return
    }
    if (cartData[itemID] >= 0) {
      delete cartData[itemID]
    }
    const cart = await userModel.findByIdAndUpdate(req.userID, { cartData })
    if (!cart) {
      res.json({ success: false, message: "Error in updating cart!" })
      return
    }
    res.json({ success: true, message: "Deleted from Cart!" })
  } catch (err) {
    res.json({ success: false, message: `Error in deleting from cart: ${err}` })
  }
}

// fetch user cart data
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userID)
    if (!userData) {
      res.json({ success: false, message: "User not found!" })
      return
    }
    let cartData = await userData.cartData
    if (!cartData) {
      res.json({ success: false, message: "Cart not found!" })
      return
    }
    // Remove items with count 0
    cartData = Object.fromEntries(
      Object.entries(cartData).filter(([key, value]) => value > 0) // eslint-disable-line no-unused-vars
    )
    res.json({ success: true, cartData })
  } catch (err) {
    res.json({
      success: false,
      message: `Error in retrieving cart items: ${err}`,
    })
  }
}

export { addToCart, removeFromCart, deleteFromCart, getCart }
