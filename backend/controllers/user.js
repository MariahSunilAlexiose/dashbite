import fs from "fs"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from "validator"

import orderModel from "../models/order.js"
import userModel from "../models/user.js"
import { checkMissingFields } from "../validationUtils.js"

const loginUser = async (req, res) => {
  const { email, password } = req.body

  let missingFieldsResponse = checkMissingFields("users", req.body, [
    "email",
    "password",
  ])
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  try {
    const user = await userModel.findOne({ email })
    if (!user) return res.json({ success: false, message: "User not found!" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.json({ success: false, message: "Invalid Credentials!" })

    const token = createToken(user._id)
    res.json({ success: true, token })
  } catch (err) {
    res.json({ success: false, message: `Error in logging in user: ${err}` })
  }
}

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

const registerUser = async (req, res) => {
  const { name, password, email } = req.body

  let missingFieldsResponse = checkMissingFields("users", req.body, [
    "name",
    "password",
    "email",
  ])
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  try {
    const exists = await userModel.findOne({ email })
    if (exists)
      return res.json({ success: false, message: "User already exists!" })

    if (name == "")
      return res.json({
        success: false,
        message: "Please enter a name!",
      })

    if (!validator.isEmail(email))
      return res.json({
        success: false,
        message: "Please enter a valid email!",
      })

    if (password.length < 8)
      return res.json({
        success: false,
        message: "Please enter a strong password!",
      })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      profilePic: `https://ui-avatars.com/api/?name=${name}`,
    })

    const user = await newUser.save()
    const token = createToken(user._id)
    res.json({ success: true, token })
  } catch (err) {
    res.json({
      success: false,
      message: `Error in registering user: ${err}`,
    })
  }
}

const getUser = async (req, res) => {
  const userID = req.params.userID || req.userID

  try {
    const user = await userModel.findById(userID).select("-password")
    if (!user) return res.json({ success: false, message: "User not found!" })
    res.json({ success: true, user })
  } catch (err) {
    res.json({ success: false, message: `Error in retrieving user: ${err}` })
  }
}

// update user
const updateUser = async (req, res) => {
  const { name, email, oldPassword, newPassword } = req.body

  try {
    const user = await userModel.findById(req.userID)
    if (!user) return res.json({ success: false, message: "User not found!" })

    if (name) user.name = name

    if (email) {
      if (!validator.isEmail(email))
        return res.json({
          success: false,
          message: "Please enter a valid email!",
        })
      user.email = email
    }

    if (oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password)
      if (!isMatch)
        return res.json({
          success: false,
          message: "Old password is incorrect!",
        })
    }

    if (newPassword) {
      if (newPassword.length < 8)
        return res.json({
          success: false,
          message: "Please enter a strong password!",
        })
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(newPassword, salt)
    }

    const updatedUser = await user.save()
    res.json({ success: true, user: updatedUser })
  } catch (err) {
    res.json({ success: false, message: `Error in updating user: ${err}` })
  }
}

const updateProfilePic = async (req, res) => {
  const { file } = req

  if (!file)
    return res.json({
      success: false,
      message: "Missing file!",
    })

  try {
    const user = await userModel.findById(req.userID)
    if (!user) return res.json({ success: false, message: "User not found!" })

    if (
      user.profilePic &&
      !user.profilePic.startsWith("https://ui-avatars.com/api/?name=")
    ) {
      fs.unlink(`uploads/${user.profilePic}`, (err) => {
        if (err)
          res.json({
            success: false,
            message: `"Error removing old profile picture: ${err}`,
          })
      })
    }

    user.profilePic = file.filename
    await user.save()
    res.json({ success: true, profilePic: user.profilePic })
  } catch (err) {
    res.json({
      success: false,
      message: `Error updating profile picture: ${err}`,
    })
  }
}

const addAddresses = async (req, res) => {
  const { shippingAddress, billingAddress } = req.body

  let missingFieldsResponse = checkMissingFields("user", req.body, [
    "shippingAddress",
    "billingAddress",
  ])
  if (missingFieldsResponse) return res.json(missingFieldsResponse)

  try {
    const user = await userModel.findById(req.userID)
    if (!user) return res.json({ success: false, message: "User not found!" })

    user.shippingAddress = shippingAddress
    user.billingAddress = billingAddress

    const updatedUser = await user.save()
    res.json({ success: true, user: updatedUser })
  } catch (err) {
    res.json({
      success: false,
      message: `Error adding addresses: ${err}`,
    })
  }
}

const updateAddresses = async (req, res) => {
  const { shippingAddress, billingAddress } = req.body

  try {
    const user = await userModel.findById(req.userID)
    if (!user) return res.json({ success: false, message: "User not found!" })

    if (shippingAddress && Object.keys(shippingAddress).length === 0)
      user.shippingAddress = {}
    else if (shippingAddress)
      user.shippingAddress = { ...user.shippingAddress, ...shippingAddress }

    if (billingAddress && Object.keys(billingAddress).length === 0)
      user.billingAddress = {}
    else if (billingAddress)
      user.billingAddress = { ...user.billingAddress, ...billingAddress }

    const updatedUser = await user.save()
    res.json({ success: true, user: updatedUser })
  } catch (err) {
    res.json({
      success: false,
      message: `Error updating addresses: ${err}`,
    })
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({})
    if (!users) return res.json({ success: false, message: "Users not found!" })
    res.json({ success: true, data: users })
  } catch (err) {
    res.json({ success: false, message: `Error in retrieving users: ${err}` })
  }
}

const deleteUser = async (req, res) => {
  const { userID } = req.params

  try {
    const user = await userModel.findById(userID)
    if (!user) return res.json({ success: false, message: "User not found!" })

    const userOrders = await orderModel.find({ userID })
    if (userOrders.length > 0)
      return res.json({ success: false, message: "User has existing orders!" })

    fs.unlink(`uploads/${user.profilePic}`, () => {})

    const deletedUser = await userModel.findByIdAndDelete(userID)
    if (!deletedUser)
      return res.json({
        success: false,
        message: "Error in deleting the user!",
      })

    res.json({ success: true, message: "User Removed!" })
  } catch (err) {
    console.error(err)
    res.json({ success: false, message: `Error in deleting user: ${err}` })
  }
}

export {
  deleteUser,
  getUsers,
  loginUser,
  registerUser,
  getUser,
  updateUser,
  updateProfilePic,
  addAddresses,
  updateAddresses,
}
