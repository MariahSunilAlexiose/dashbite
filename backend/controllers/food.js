import dishModel from "../models/food.js"

// add dish item
const addDish = async (req, res) => {
  let image_filename = `${req.file.filename}`
  const food = new dishModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    rating: req.body.rating,
    image: image_filename,
  })
  try {
    await food.save()
    res.json({ success: true, message: "Dish Added" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" })
  }
}

// list dishes
const listDishes = async (req, res) => {
  try {
    const dishes = await dishModel.find({})
    res.json({ success: true, data: dishes })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" })
  }
}

export { addDish, listDishes }
