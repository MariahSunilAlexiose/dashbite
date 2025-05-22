import React, { useContext, useEffect, useState } from "react"

import { Card } from "@cmp"
import { StoreContext } from "@context"
import PropTypes from "prop-types"

import { fetchEndpoint } from "@/constants"

const TabTrigger = ({ label, id, activeTab, setActiveTab }) => (
  <div
    className={`${activeTab === id ? "bg-foreground text-accent shadow" : ""} ring-offset-background focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`}
    onClick={() => setActiveTab(id)}
  >
    {label}
  </div>
)

TabTrigger.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
}

const MenuCategoryTabs = ({ menu }) => {
  const { url } = useContext(StoreContext)
  const [activeTab, setActiveTab] = useState(0)
  const [dishes, setDishes] = useState([])
  const [categories, setCategories] = useState([])

  const fetchData = async () => {
    if (!menu || menu.length === 0) return

    try {
      // get dishes
      const dishesData = await Promise.all(
        menu.map(async (item) => {
          return await fetchEndpoint(url, `dish/${item}`)
        })
      )
      setDishes(dishesData)

      // get categories
      const categoryIDs = [
        ...new Set(dishesData.map((dish) => dish.categoryID)),
      ]
      const categoriesData = await Promise.all(
        categoryIDs.map(async (item) => {
          return await fetchEndpoint(url, `category/${item}`)
        })
      )
      setCategories(categoriesData)
    } catch (err) {
      console.error(err)
      console.error("Error fetching dishes:", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [menu])

  return (
    <div>
      <div className="inline-flex h-9 items-center justify-center rounded-lg p-1">
        <TabTrigger
          id={0}
          label="All"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {categories.map((category) => (
          <TabTrigger
            key={category._id}
            id={category._id}
            label={category.name}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </div>
      <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {dishes
          .filter((dish) =>
            activeTab !== 0 ? dish.categoryID === activeTab : true
          )
          .map((dish) => {
            return (
              <Card
                key={dish._id}
                id={dish._id}
                image={dish.image}
                title={dish.name}
                rating={dish.rating}
                price={dish.price}
              />
            )
          })}
      </div>
    </div>
  )
}

MenuCategoryTabs.propTypes = {
  menu: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default MenuCategoryTabs
