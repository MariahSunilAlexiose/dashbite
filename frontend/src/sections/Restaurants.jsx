import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, Skeleton } from "@cmp"
import { StoreContext } from "@context"
import { StarIcon } from "@icons"

const Restaurants = () => {
  const { url, restaurants } = useContext(StoreContext)
  const navigate = useNavigate()

  const [activeIndex, setActiveIndex] = useState(0) // First restaurant opens by default
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {loading ? (
        <div>
          <Skeleton className="h-10 w-full max-w-[55vw] rounded" />
          <Skeleton className="mt-10 h-96 w-full rounded" />
        </div>
      ) : (
        <div>
          <h2>Discover Exceptional Restaurants</h2>
          <p className="max-w-[55vw] leading-5">
            Indulge in a curated selection of top-tier restaurants, each
            offering unique flavors and unforgettable dining experiences.
            Whether you are seeking cozy comfort or bold innovation, our
            destinations are designed to delight your taste buds and create
            lasting memories.
          </p>
          <div className="group/list flex justify-center gap-1 pt-10">
            <div className="peer order-last flex w-max items-center justify-center gap-2">
              {loading ? (
                <Skeleton className="mt-10 h-96 w-full rounded" />
              ) : (
                restaurants.slice(0, 10).map((restaurant, index) => (
                  <div
                    key={restaurant._id}
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
                          <Button
                            variant="badge"
                            size="badge"
                            key={cuisine._id}
                            onClick={() => navigate(`/cuisine/${cuisine.id}`)}
                          >
                            {cuisine.name}
                          </Button>
                        ))}
                      <div className="flex justify-between">
                        <h2
                          className="cursor-pointer"
                          onClick={() =>
                            navigate(`/restaurant/${restaurant._id}`)
                          }
                        >
                          {restaurant.name}
                        </h2>
                        <div className="flex items-center gap-1">
                          <img
                            src={StarIcon}
                            alt="Star Icon"
                            className="h-8 w-8"
                          />
                          <h3>{restaurant.rating}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Restaurants
