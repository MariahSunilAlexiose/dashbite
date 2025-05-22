import React from "react"

import { MenuCategoryTabs } from "@cmp"
import PropTypes from "prop-types"

const RestaurantOverview = ({ description, menu }) => {
  return (
    <div>
      <p>{description}</p>
      {menu?.length > 0 && (
        <>
          <p className="text-gray-20 text-sm">MENU</p>
          <MenuCategoryTabs menu={menu} />
        </>
      )}
    </div>
  )
}

RestaurantOverview.propTypes = {
  description: PropTypes.string.isRequired,
  menu: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default RestaurantOverview
