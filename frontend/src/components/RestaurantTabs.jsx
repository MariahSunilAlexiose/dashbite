import React, { useState } from "react"

import { PhotoGallery } from "@cmp"
import { RestaurantOverview } from "@sections"
import PropTypes from "prop-types"

const TabTrigger = ({ label, activeTab, setActiveTab }) => (
  <div
    className={`${activeTab === label.toLowerCase() ? "text-primary underline-offset-14 underline" : ""} ring-offset-background focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`}
    onClick={() => setActiveTab(label.toLowerCase())}
  >
    {label}
  </div>
)

TabTrigger.propTypes = {
  label: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
}

const RestaurantTabs = ({ restaurant }) => {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div>
      <div className="border-b-border border-b">
        <div className="inline-flex h-9 items-center justify-center rounded-lg p-1">
          <TabTrigger
            label="Overview"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabTrigger
            label="Photos"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabTrigger
            label="Reviews"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>
      {activeTab === "overview" ? (
        <div className="mt-2">
          <RestaurantOverview
            description={restaurant.description}
            menu={restaurant.dishIDs}
          />
        </div>
      ) : activeTab === "photos" ? (
        <div className="pt-5">
          <PhotoGallery
            images={[
              ...restaurant.images.slice(3),
              ...restaurant.images.slice(0, 3),
            ]}
          />
        </div>
      ) : (
        <p>Reviews</p>
      )}
    </div>
  )
}

RestaurantTabs.propTypes = {
  restaurant: PropTypes.object.isRequired,
}

export default RestaurantTabs
