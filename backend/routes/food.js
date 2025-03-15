import express from "express"
import multer from "multer"

import { addDish, listDishes } from "../controllers/food.js"

const dishRouter = express.Router()

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`)
  },
})

const upload = multer({ storage: storage })

dishRouter.post("/add", upload.single("image"), addDish)
dishRouter.get("/", listDishes)

export default dishRouter
