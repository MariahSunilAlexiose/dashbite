import React, { useState } from "react"

import { MinusIcon, PlusDarkIcon, PlusIcon } from "@icons"
import PropTypes from "prop-types"

import { ratings } from "@/constants"

const Card = ({ title, image, description, rating, price }) => {
  const [itemCount, setItemCount] = useState(0)
  return (
    <div className="bg-border text-foreground flex flex-col rounded-xl border shadow">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="h-[330px] w-[500px] rounded-t-xl object-cover"
        />
        {!itemCount ? (
          <div className="dark:bg-blue-30 absolute bottom-6 right-5 cursor-pointer rounded-full bg-white p-1 shadow-md">
            <img
              src={PlusIcon}
              alt="Plus Icon"
              className="h-5 w-5"
              onClick={() => setItemCount((prev) => prev + 1)}
            />
          </div>
        ) : (
          <div className="absolute bottom-4 right-4">
            <div className="dark:bg-blue-30 flex items-center justify-center gap-2 rounded-full bg-white p-2">
              <img
                src={MinusIcon}
                alt="Minus Icon"
                className="h-5 w-5 cursor-pointer"
                onClick={() => setItemCount((prev) => prev - 1)}
              />
              <p className="text-blue-90 m-0 p-0">{itemCount}</p>
              <img
                src={PlusDarkIcon}
                alt="PlusIcon"
                className="h-5 w-5 cursor-pointer"
                onClick={() => setItemCount((prev) => prev + 1)}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between gap-2 px-3 py-5">
        <div className="flex justify-between gap-2">
          <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
          <div className="content-center">
            {ratings.map(
              ({ label, image, number }) =>
                rating === number && (
                  <img
                    key={number}
                    src={image}
                    alt={label}
                    width={91}
                    style={{ height: "18px" }}
                  />
                )
            )}
          </div>
        </div>
        <p className="m-0 text-sm">{description}</p>
        <p className="mt-1">${price}</p>
      </div>
    </div>
  )
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
}

export default Card
