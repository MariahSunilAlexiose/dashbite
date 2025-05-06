import express from "express"
import multer from "multer"

import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  getCategoryDishes,
  updateCategory,
} from "../controllers/category.js"
import adminAuthMiddleware from "../middleware/adminauth.js"

const categoryRouter = express.Router()

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`)
  },
})
const upload = multer({ storage: storage })

categoryRouter.post(
  "/",
  upload.single("image"),
  adminAuthMiddleware,
  addCategory
)
categoryRouter.put(
  "/:categoryID",
  upload.single("image"),
  adminAuthMiddleware,
  updateCategory
)
categoryRouter.delete("/:categoryID", adminAuthMiddleware, deleteCategory)
categoryRouter.get("/:categoryID", getCategory)
categoryRouter.get("/", getCategories)
categoryRouter.get("/:categoryID/dishes", getCategoryDishes)

export default categoryRouter
