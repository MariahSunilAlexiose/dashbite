import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { Card } from "@cmp"
import { StoreContext } from "@context"
import { useToast } from "@providers"
import axios from "axios"

const Cuisine = () => {
  const { cuisineID } = useParams()
  const { url } = useContext(StoreContext)
  const { addToast } = useToast()
  const [cuisine, setCuisine] = useState({})
  const [dishes, setDishes] = useState([])

  const fetchCuisine = async () => {
    try {
      const res = await axios.get(`${url}/api/cuisine/${cuisineID}`)
      if (!res.data.success) {
        console.error(res.data.message)
        return addToast("error", "Error", res.data.message)
      }
      setCuisine(res.data.data)

      const dishRes = await axios.get(`${url}/api/cuisine/${cuisineID}/dishes/`)
      if (!dishRes.data.success) {
        console.error(dishRes.data.message)
        return addToast("error", "Error", dishRes.data.message)
      }
      if (dishRes.data.success) {
        setDishes(dishRes.data.data)
      }
    } catch (err) {
      console.error("Error fetching cuisine:", err)
      addToast("error", "Error", "Failed to fetch cuisine!")
    }
  }

  useEffect(() => {
    fetchCuisine()
  }, [])
  return (
    <div className="">
      <div
        className="py-30 bg-cover bg-center text-center text-white"
        style={{ backgroundImage: `url(${url}/images/${cuisine.image})` }}
      >
        <h1 className="text-3xl font-bold">{cuisine.name} Cuisine</h1>
      </div>

      <section className="mx-auto my-10 max-w-4xl">
        <h2 className="text-center text-2xl font-bold">Dishes</h2>
        {dishes.length > 0 ? (
          <div className="mt-6">
            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {dishes.map((dish) => (
                <Card
                  key={dish._id}
                  id={dish._id}
                  image={dish.image}
                  title={dish.name}
                  rating={dish.rating}
                  description={dish.description}
                  price={dish.price}
                />
              ))}
            </div>
          </div>
        ) : (
          <>No Dishes in this cuisine yet!</>
        )}
      </section>
    </div>
  )
}

export default Cuisine
