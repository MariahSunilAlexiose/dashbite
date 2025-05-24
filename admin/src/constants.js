import {
  Rating1Icon,
  Rating2Icon,
  Rating3Icon,
  Rating4Icon,
  Rating5Icon,
} from "@icons"
import axios from "axios"

export const backendURL = "http://localhost:4000/api"

export const backendImgURL = "http://localhost:4000/images"

export const keyMapping = {
  categoryName: "Category",
  userID: "User ID",
  payment: "Payment Status",
  deliveryType: "Delivery Type",
  shippingAddress: "Shipping Address",
  billingAddress: "Billing Address",
  cuisineNames: "Cuisines",
  openingHours: "Opening Hours",
  restaurantName: "Restaurant",
  username: "User",
  servingSize: "Serving Size",
}

export const ratings = [
  {
    label: "Ratings 1",
    image: Rating1Icon,
    number: 1,
  },
  {
    label: "Ratings 2",
    image: Rating2Icon,
    number: 2,
  },
  {
    label: "Ratings 3",
    image: Rating3Icon,
    number: 3,
  },
  {
    label: "Ratings 4",
    image: Rating4Icon,
    number: 4,
  },
  {
    label: "Ratings 5",
    image: Rating5Icon,
    number: 5,
  },
]

export const formatDate = (dateString) => {
  const options = { day: "numeric", month: "short", year: "numeric" }
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(dateString)
  )
  const [month, day, year] = formattedDate.replace(",", "").split(" ")
  return `${day} ${month} ${year}`
}

export const payment = [
  { _id: "Not Paid", name: "Not Paid" },
  { _id: "Paid", name: "Paid" },
]

export const deliveryType = [
  { _id: "Free Shipping", name: "Free Shipping" },
  { _id: "Express Shipping", name: "Express Shipping" },
  { _id: "Pick Up", name: "Pick Up" },
]

export const orderStatus = [
  { _id: "Dish Processing...", name: "Dish Processing..." },
  { _id: "Shipped", name: "Shipped" },
  { _id: "Delivered Up", name: "Delivered" },
]

export const onChangeHandler = (e, setFormData) => {
  setFormData((prevFormData) => ({
    ...prevFormData,
    address: { ...prevFormData.address, [e.target.name]: e.target.value },
  }))
}

export const allergenList = [
  "Dairy",
  "Gluten",
  "Eggs",
  "Fish",
  "Shellfish",
  "Tree nuts",
  "Peanuts",
  "Soybeans",
]

export const ingredientList = [
  "Flour",
  "Rice",
  "Bread",
  "Potatoes",
  "Chicken",
  "Beef",
  "Pork",
  "Fish",
  "Milk",
  "Cheese",
  "Butter",
  "Herbs",
  "Eggs",
  "Tomatoes",
]

export const getRatingImage = (dishRating) => {
  const rating = ratings.find((r) => r.number === Math.round(dishRating))
  return rating ? rating.image : null
}

export const fetchBackendData = async (endpoint, headers = {}) => {
  try {
    const res = await axios.get(`${backendURL}/${endpoint}`, {
      headers: headers,
    })
    if (!res.data.success) {
      console.error(res.data.message)
      return { success: false, message: res.data.message }
    }

    return { success: true, data: res.data.data }
  } catch (err) {
    console.error(err.message || err)
    return { success: false, message: err.message || err }
  }
}

export const fetchEndpoint = async (endpoint, headers = {}) => {
  const res = await fetchBackendData(endpoint, headers)

  if (!res.success) {
    console.error(res.message)
    return []
  }

  return res.data
}

export const fetchCuisines = async (dishes) => {
  const cuisines = await Promise.all(
    dishes.cuisineIDs.map(async (cuisineID) => {
      const cuisineRes = await fetchEndpoint(`cuisine/${cuisineID}`)
      return { name: cuisineRes.name, _id: cuisineID }
    })
  )
  return cuisines
}

export const fetchRestaurantDishes = async (restaurant) => {
  const dishes = await Promise.all(
    restaurant.dishIDs.map(async (dishID) => {
      const dish = await fetchEndpoint(`dish/${dishID}`)
      return dish
    })
  )
  return dishes
}

export const fetchAndSet = async (name, setter, options) => {
  const data = await fetchEndpoint(name, options)
  setter(data)
}

export const fetchTableData = async (fetches, tableName) => {
  await Promise.all(
    fetches[tableName]?.map(({ name, setter, options }) =>
      fetchAndSet(name, setter, options)
    ) || []
  )
}

export const fetchData = async (formData, setters) => {
  const { setUsers, setDishes, setCategories, setCuisines, setRestaurants } =
    setters
  const fetchConfig = [
    {
      key: "userID",
      name: "user",
      setter: setUsers,
      options: { token: import.meta.env.VITE_ADMIN_TOKEN },
    },
    { key: "items", name: "dish", setter: setDishes },
    { key: "dishIDs", name: "dish", setter: setDishes },
    { key: "category", name: "category", setter: setCategories },
    { key: "cuisineIDs", name: "cuisine", setter: setCuisines },
    {
      key: "restaurantID",
      name: "restaurant",
      setter: setRestaurants,
    },
  ]

  await Promise.all(
    fetchConfig
      .filter(({ key }) => formData?.[key]) // fetch if the key exists in formData
      .map(
        ({ name, setter, options }) =>
          setter && fetchAndSet(name, setter, options)
      ) // fetch if setter exists
  )
}
