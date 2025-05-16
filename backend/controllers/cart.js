import userModel from "../models/user.js"

const addToCart = async (req, res) => {
  const { itemID } = req.body

  if (!itemID)
    return res.json({ success: false, message: "ItemID not present!" })

  try {
    const userData = await userModel.findById(req.userID)
    if (!userData)
      return res.json({ success: false, message: "User not found!" })

    let cartData = await userData.cartData
    if (!cartData)
      return res.json({ success: false, message: "Cart not found!" })

    if (!cartData[itemID]) cartData[itemID] = 1
    else cartData[itemID] += 1

    const cart = await userModel.findByIdAndUpdate(req.userID, { cartData })
    if (!cart)
      return res.json({ success: false, message: "Error in updating cart!" })
    res.json({ success: true, message: "Added to Cart!" })
  } catch (err) {
    res.json({ success: false, message: `Error in adding to cart: ${err}` })
  }
}

const removeFromCart = async (req, res) => {
  const { itemID } = req.body

  if (!itemID)
    return res.json({ success: false, message: "ItemID not present!" })

  try {
    let userData = await userModel.findById(req.userID)
    if (!userData)
      return res.json({ success: false, message: "User not found!" })

    let cartData = await userData.cartData
    if (!cartData)
      return res.json({ success: false, message: "Cart not found!" })

    if (cartData[itemID] > 0) cartData[itemID] -= 1
    else if (cartData[itemID] == 0) delete cartData[itemID]

    const cart = await userModel.findByIdAndUpdate(req.userID, { cartData })
    if (!cart)
      return res.json({ success: false, message: "Error in updating cart!" })
    res.json({ success: true, message: "Removed from Cart!" })
  } catch (err) {
    res.json({ success: false, message: `Error in removing from cart: ${err}` })
  }
}

const deleteFromCart = async (req, res) => {
  const { itemID } = req.body

  if (!itemID)
    return res.json({ success: false, message: "ItemID not present!" })

  try {
    const userData = await userModel.findById(req.userID)
    if (!userData)
      return res.json({ success: false, message: "User not found!" })

    const cartData = await userData.cartData
    if (!cartData)
      return res.json({ success: false, message: "Cart not found!" })

    if (cartData[itemID] >= 0) delete cartData[itemID]

    const cart = await userModel.findByIdAndUpdate(req.userID, { cartData })
    if (!cart)
      return res.json({ success: false, message: "Error in updating cart!" })
    res.json({ success: true, message: "Deleted from Cart!" })
  } catch (err) {
    res.json({ success: false, message: `Error in deleting from cart: ${err}` })
  }
}

const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userID)
    if (!userData)
      return res.json({ success: false, message: "User not found!" })

    let cartData = await userData.cartData
    if (!cartData)
      return res.json({ success: false, message: "Cart not found!" })

    // Remove items with count 0
    cartData = Object.fromEntries(
      Object.entries(cartData).filter(([key, value]) => value > 0) // eslint-disable-line no-unused-vars
    )
    res.json({ success: true, cartData })
  } catch (err) {
    res.json({
      success: false,
      message: `Error in fetching cart items: ${err}`,
    })
  }
}

export { addToCart, removeFromCart, deleteFromCart, getCart }
