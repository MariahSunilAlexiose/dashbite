import React, { useContext, useState } from "react"

import { Avatar, Card } from "@cmp"
import { StoreContext } from "@context"

const Menu = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const { categories, dishes } = useContext(StoreContext)

  console.log(selectedAvatar)

  return (
    <div className="flex flex-col gap-6">
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
