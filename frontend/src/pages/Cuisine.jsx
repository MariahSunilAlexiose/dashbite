import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { Card } from "@cmp"
import { StoreContext } from "@context"
import { useToast } from "@providers"

import { fetchEndpoint } from "@/constants"

const Cuisine = () => {
  const { cuisineID } = useParams()
  const { url } = useContext(StoreContext)
  const { addToast } = useToast()
  const [cuisine, setCuisine] = useState({})
  const [dishes, setDishes] = useState([])

  const fetchCuisine = async () => {
    try {
      // get cuisine
      const cuisineData = await fetchEndpoint(url, `cuisine/${cuisineID}`)
      setCuisine(cuisineData)

      // get cuisine dishes
      const dishesData = await fetchEndpoint(
        url,
        `cuisine/${cuisineID}/dishes/`
      )
      setDishes(dishesData)
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
            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {dishes.map((dish) => (
                <Card
                  key={dish._id}
                  id={dish._id}
                  image={dish.image}
                  title={dish.name}
                  rating={dish.rating}
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
