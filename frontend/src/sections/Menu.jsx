import React, { useState } from "react"

import { Avatar, Card } from "@cmp"

import { categoryLinks, dishes } from "@/constants"

const Menu = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const handleAvatarClick = (label) => {
    setSelectedAvatar(label)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2>Explore our menu</h2>
        <p className="max-w-[55vw] leading-5">
          Choose from a diverse menu featuring a delectable array of dishes. Our
          mission is to satisfy your cravings and elevate your dining
          experience, one delicious meal at a time.
        </p>
        <div className="mt-6 flex gap-7 overflow-x-scroll">
          {categoryLinks.map((link, index) => (
            <Avatar
              key={index}
              image={link.image}
              title={link.label}
              isSelected={selectedAvatar === link.label}
              onClick={() => handleAvatarClick(link.label)}
            />
          ))}
        </div>
      </div>
      <div>
        <h2>Top Dishes</h2>
        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {dishes
            .filter((dish) =>
              selectedAvatar ? dish.category === selectedAvatar : true
            )
            .map((dish) => (
              <Card
                key={dish._id}
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
