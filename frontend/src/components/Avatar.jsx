import React from "react"

import PropTypes from "prop-types"

const Avatar = ({ image, title }) => {
  return (
    <div className="flex flex-col gap-4 text-center">
      <div className="flex content-center items-center justify-center">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full">
          {image ? (
            <img
              src={image}
              alt={title}
              className="aspect-square h-full w-full"
            />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center rounded-full">
              {title.slice(0, 2)}
            </div>
          )}
        </div>
      </div>
      <p className="mt-0 text-sm font-semibold">{title}</p>
    </div>
  )
}

Avatar.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
}

export default Avatar
