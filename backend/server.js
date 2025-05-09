import cors from "cors"
import express from "express"

import { connectDB } from "./config/db.js"
import cartRouter from "./routes/cart.js"
import categoryRouter from "./routes/category.js"
import cuisineRouter from "./routes/cuisine.js"
import dishRouter from "./routes/dish.js"
import orderRouter from "./routes/order.js"
import restaurantRouter from "./routes/restaurant.js"
import reviewRouter from "./routes/review.js"
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

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const message = `This is the unexpected field: ${error.field}`
  console.log(message)
  return res.status(500).send(message)
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
app.use("/api/category", categoryRouter)
app.use("/api/cuisine", cuisineRouter)
app.use("/api/restaurant", restaurantRouter)
app.use("/api/review", reviewRouter)
