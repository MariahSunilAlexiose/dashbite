import {
  Rating1Icon,
  Rating2Icon,
  Rating3Icon,
  Rating4Icon,
  Rating5Icon,
} from "@icons"
import axios from "axios"

const ratings = [
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

export const getRatingImage = (dishRating) => {
  const rating = ratings.find((r) => r.number === Math.round(dishRating))
  return rating ? rating.image : null
}

export const shippingOptions = [
  {
    title: "Free Shipping",
    cost: "$0.00",
  },
  {
    title: "Express Shipping",
    cost: "+$15.00",
  },
  {
    title: "Pick Up",
    cost: "%5.00",
  },
]

export const formatDate = (dateString) => {
  if (!dateString) return ""
  const options = { day: "numeric", month: "short", year: "numeric" }
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(dateString)
  )
  const [month, day, year] = formattedDate.replace(",", "").split(" ")
  return `${day} ${month} ${year}`
}

export const logout = ({ setToken, navigate }) => {
  localStorage.removeItem("token")
  setToken("")
  navigate("/")
}

export const fetchBackendData = async (url, endpoint, headers = {}) => {
  try {
    const res = await axios.get(`${url}/api/${endpoint}`, {
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

export const fetchEndpoint = async (url, endpoint, headers = {}) => {
  const res = await fetchBackendData(url, endpoint, headers)

  if (!res.success) {
    return []
  }

  return res.data
}
