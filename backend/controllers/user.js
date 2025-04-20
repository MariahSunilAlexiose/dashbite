import fs from "fs"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from "validator"

import userModel from "../models/user.js"

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: "User does not exist!" })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials!" })
    }
    const token = createToken(user._id)
    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" })
  }
}

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

// register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body
  try {
    const exists = await userModel.findOne({ email })
    if (exists) {
      return res.json({ success: false, message: "User already exists!" })
    }

    if (name == "") {
      return res.json({
        success: false,
        message: "Please enter a name!",
      })
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email!",
      })
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      })
    }

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
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" })
  }
}

// get user
const getUser = async (req, res) => {
  const { userID } = req.params

  try {
    const user = await userModel.findById(userID).select("-password")
    if (!user) {
      return res.json({ success: false, message: "User not found!" })
    }

    res.json({ success: true, user })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error retrieving user!" })
  }
}

// update user
const updateUser = async (req, res) => {
  const { userID } = req.params
  const { name, email, oldPassword, newPassword } = req.body

  try {
    const user = await userModel.findById(userID)
    if (!user) {
      return res.json({ success: false, message: "User not found!" })
    }

    if (name) {
      user.name = name
    }

    if (email) {
      if (!validator.isEmail(email)) {
        return res.json({
          success: false,
          message: "Please enter a valid email!",
        })
      }
      user.email = email
    }

    if (oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password)
      if (!isMatch) {
        return res.json({
          success: false,
          message: "Old password is incorrect!",
        })
      }
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        return res.json({
          success: false,
          message: "Please enter a strong password!",
        })
      }
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(newPassword, salt)
    }

    const updatedUser = await user.save()
    res.json({ success: true, user: updatedUser })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error updating user!" })
  }
}

const updateProfilePic = async (req, res) => {
  const { userID } = req.params
  const { file } = req
  try {
    console.log(req.file)
    if (!file) {
      return res.json({ success: false, message: "No file provided!" })
    }

    const user = await userModel.findById(userID)
    if (!user) {
      return res.json({ success: false, message: "User not found!" })
    }

    if (user.profilePic) {
      fs.unlink(`uploads/${user.profilePic}`, (err) => {
        if (err) console.error("Error removing old profile picture:", err)
      })
    }

    user.profilePic = file.filename
    await user.save()

    res.json({ success: true, profilePic: user.profilePic })
  } catch (error) {
    console.error("Error updating profile picture:", error)
    res.json({ success: false, message: "Error updating profile picture!" })
  }
}

export { loginUser, registerUser, getUser, updateUser, updateProfilePic }
