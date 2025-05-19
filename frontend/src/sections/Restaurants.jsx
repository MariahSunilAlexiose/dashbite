import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import { StoreContext } from "@context"
import { StarIcon } from "@icons"

const Restaurants = () => {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0) // First restaurant opens by default
  const { url, restaurants } = useContext(StoreContext)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2>Discover Exceptional Restaurants</h2>
        <p className="max-w-[55vw] leading-5">
          Indulge in a curated selection of top-tier restaurants, each offering
          unique flavors and unforgettable dining experiences. Whether you are
          seeking cozy comfort or bold innovation, our destinations are designed
          to delight your taste buds and create lasting memories.
        </p>
      </div>
      <div className="group/list flex justify-center gap-1">
        <div className="peer order-last flex w-max items-center justify-center gap-2">
          {restaurants.slice(0, 10).map((restaurant, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              className={`group relative h-96 overflow-hidden transition-all duration-500 ${
                activeIndex === index ? "w-96" : "w-20"
              }`}
            >
              <img
                className="h-full w-full rounded-lg object-cover"
                src={`${url}/images/${restaurant.images[0]}`}
                alt={restaurant.name}
              />
              <div className="absolute bottom-0 left-0 w-full p-3 text-white transition-opacity duration-500">
                {activeIndex === index &&
                  restaurant.cuisines &&
                  restaurant.cuisines.map((cuisine) => (
                    <div
                      key={cuisine._id}
                      onClick={() => navigate(`/cuisine/${cuisine.id}`)}
                      className="bg-accent text-primary w-fit cursor-pointer rounded-full border px-2 text-xs"
                    >
                      {cuisine.name}
                    </div>
                  ))}
                <div className="flex justify-between">
                  <h2
                    className="cursor-pointer"
                    onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                  >
                    {restaurant.name}
                  </h2>
                  <div className="flex items-center gap-1">
                    <img src={StarIcon} alt="Star Icon" className="h-8 w-8" />
                    <h3>{restaurant.rating}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Restaurants
