import React, { useContext } from "react"

import { StoreContext } from "@context"
import PropTypes from "prop-types"

const PhotoGallery = ({ images }) => {
  const { url } = useContext(StoreContext)
  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 lg:gap-8 xl:columns-4 [&>img:not(:first-child)]:mt-5 lg:[&>img:not(:first-child)]:mt-8">
      {images.map((image) => (
        <img
          key={image}
          src={`${url}/images/${image}`}
          alt="Restaurant Image"
        />
      ))}
    </div>
  )
}

export default PhotoGallery

PhotoGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
}
