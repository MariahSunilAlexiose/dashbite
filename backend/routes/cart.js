import express from "express"

import {
  addToCart,
  deleteFromCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.js"
import authMiddleware from "../middleware/auth.js"

const cartRouter = express.Router()

cartRouter.post("/add", authMiddleware, addToCart)
cartRouter.post("/remove", authMiddleware, removeFromCart)
cartRouter.delete("/delete", authMiddleware, deleteFromCart)
cartRouter.get("/", authMiddleware, getCart)

export default cartRouter
