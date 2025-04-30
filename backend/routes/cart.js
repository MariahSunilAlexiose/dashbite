import express from "express"

import {
  addToCart,
  deleteFromCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.js"
import authMiddleware from "../middleware/auth.js"

const cartRouter = express.Router()

cartRouter.post("/", authMiddleware, addToCart)
cartRouter.put("/", authMiddleware, removeFromCart)
cartRouter.delete("/", authMiddleware, deleteFromCart)
cartRouter.get("/", authMiddleware, getCart)

export default cartRouter
