import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"

import { StoreContext } from "@context"
import { MinusIcon, PlusDarkIcon, PlusIcon, StarIcon } from "@icons"
import PropTypes from "prop-types"

const Card = ({ id, title, image, description, rating, price }) => {
  const navigate = useNavigate()
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext)
  const cartItemCount =
    cartItems && cartItems[id] !== undefined ? cartItems[id] : 0
  return (
    <div className="bg-border text-foreground flex cursor-pointer flex-col rounded-xl border shadow">
      <div className="relative">
        <img
          src={url + "/images/" + image}
          alt={title}
          className="h-[330px] w-[500px] rounded-t-xl object-cover"
        />
        {cartItemCount == 0 ? (
          <div className="dark:bg-blue-30 absolute bottom-6 right-5 cursor-pointer rounded-full bg-white p-1 shadow-md">
            <img
              src={PlusIcon}
              alt="Plus Icon"
              className="h-5 w-5"
              onClick={() => addToCart(id)}
            />
          </div>
        ) : (
          <div className="absolute bottom-4 right-4">
            <div className="dark:bg-blue-30 flex items-center justify-center gap-2 rounded-full bg-white p-2">
              <div className="bg-red-10 cursor-pointer rounded-full p-1">
                <img
                  src={MinusIcon}
                  alt="Minus Icon"
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => removeFromCart(id)}
                />
              </div>
              <p className="text-blue-90 m-0 p-0">{cartItemCount}</p>
              <div className="bg-accent cursor-pointer rounded-full p-1">
                <img
                  src={PlusDarkIcon}
                  alt="Plus Icon"
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => addToCart(id)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className="flex flex-col justify-between gap-2 px-3 py-5"
        onClick={() => navigate(`/dish/${id}`)}
      >
        <div className="flex justify-between gap-2">
          <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
          <div className="flex items-center gap-1">
            <img src={StarIcon} alt="Star Icon" className="h-5 w-5" />
            <p className="text-primary m-0 font-black">{rating}</p>
          </div>
        </div>
        <p className="m-0 text-sm">{description}</p>
        <p className="mt-1">${price}</p>
      </div>
    </div>
  )
}

Card.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
}

export default Card
