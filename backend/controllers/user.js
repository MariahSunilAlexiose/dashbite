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
export { loginUser, registerUser, getUser }
