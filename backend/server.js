import cors from "cors"
import express from "express"

import { connectDB } from "./config/db.js"
import adminRouter from "./routes/admin.js"
import cartRouter from "./routes/cart.js"
import dishRouter from "./routes/food.js"
import orderRouter from "./routes/order.js"
import userRouter from "./routes/user.js"

import "dotenv/config.js"

// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

// database connection
connectDB()

app.get("/", (req, res) => {
  res.send("API is working!")
})

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})

app.use("/api/dish", dishRouter)

// route to see image (ROUTE: /images/[image_name])
app.use("/images", express.static("uploads"))

app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/admin", adminRouter)
