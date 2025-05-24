import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"

import { StoreContext } from "@context"
import { MinusIcon, PlusIcon } from "@icons"
import PropTypes from "prop-types"

import { getRatingImage } from "@/constants"

const Card = ({ id, title, image, rating, price }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext)
  const navigate = useNavigate()

  const cartItemCount =
    cartItems && cartItems[id] !== undefined ? cartItems[id] : 0
  return (
    <div className="text-foreground flex cursor-pointer flex-col">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={`${url}/images/${image}`}
          alt={title}
          className="h-[330px] w-[500px] object-cover"
        />
        {cartItemCount == 0 ? (
          <div className="bg-background absolute right-5 top-6 cursor-pointer rounded-full p-1 shadow-md">
            <img
              src={PlusIcon}
              alt="Plus Icon"
              className="h-5 w-5"
              onClick={() => addToCart(id)}
            />
          </div>
        ) : (
          <div className="absolute right-4 top-4">
            <div className="bg-background flex items-center justify-center gap-2 rounded-full p-2">
              <div className="bg-red-10 dark:bg-red-90 cursor-pointer rounded-full p-1">
                <img
                  src={MinusIcon}
                  alt="Minus Icon"
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => removeFromCart(id)}
                />
              </div>
              <p className="text-foreground m-0 p-0">{cartItemCount}</p>
              <div className="bg-accent cursor-pointer rounded-full p-1">
                <img
                  src={PlusIcon}
                  alt="Plus Icon"
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => addToCart(id)}
                />
              </div>
            </div>
          </div>
        )}
        <div
          className="backdrop-blur-xs absolute bottom-0 left-0 w-full rounded-2xl bg-white/30 p-4 text-black backdrop-saturate-50"
          onClick={() => navigate(`/dish/${id}`)}
        >
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1">
                <img
                  src={getRatingImage(rating)}
                  alt="Rating Icon"
                  className="h-4 w-20"
                />
              </div>
              <h3 className="font-semibold tracking-tight">{title}</h3>
            </div>
            <div className="flex">
              <p className="mt-5 text-sm">$</p>
              <p className="text-2xl">{price}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Card.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
}

export default Card
