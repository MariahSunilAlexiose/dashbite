import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Avatar, Button, Card } from "@cmp"
import { StoreContext } from "@context"
import { ArrowRightIcon } from "@icons"

const Menu = () => {
  const navigate = useNavigate()
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const { categories, dishes, cuisines, url } = useContext(StoreContext)
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2>Discover Bold Flavors</h2>
        <p className="max-w-[55vw] leading-5">
          Explore a variety of cuisines, from timeless classics to innovative
          creations. Every dish is crafted to delight your senses and elevate
          your dining experience.
        </p>
        <div className="mt-6 flex gap-6 overflow-x-scroll">
          {cuisines.map((link) => (
            <div
              key={link._id}
              className="grid grid-cols-1 justify-center gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              <div className="md:h-35 md:w-35 hover:shadow-blue-90 h-30 w-30 lg:h-50 lg:w-50 group relative cursor-pointer items-center overflow-hidden rounded-3xl transition-shadow">
                <div className="h-full w-full">
                  <img
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-125"
                    src={`${url}/images/${link.image}`}
                    alt={link.name}
                  />
                </div>
                <div className="absolute bottom-0 left-0 flex w-full items-center justify-between p-4">
                  <h1 className="text-2xl font-bold text-white">{link.name}</h1>
                  <Button
                    size="icon"
                    className="rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    onClick={() => navigate(`/cuisine/${link._id}`)}
                  >
                    <img
                      src={ArrowRightIcon}
                      alt="Arrow Right Icon"
                      className="h-4 w-4"
                    />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>Explore our menu</h2>
        <p className="max-w-[55vw] leading-5">
          Choose from a diverse menu featuring a delectable array of dishes. Our
          mission is to satisfy your cravings and elevate your dining
          experience, one delicious meal at a time.
        </p>
        <div className="mt-6 flex gap-1.5 overflow-x-scroll">
          {categories.map((link) => (
            <Avatar
              key={link._id}
              image={link.image}
              title={link.name}
              isSelected={selectedAvatar === link._id}
              onClick={() => {
                setSelectedAvatar(link._id)
              }}
            />
          ))}
        </div>
      </div>
      <div>
        <h2>Top Dishes</h2>
        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {dishes
            .filter((dish) =>
              selectedAvatar ? dish.categoryID === selectedAvatar : true
            )
            .map((dish) => (
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
    </div>
  )
}

export default Menu
