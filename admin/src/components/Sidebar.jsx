import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { ThemeToggle } from "@cmp"
import { dark, SidebarContext } from "@context"
import {
  ChevronFirstIcon,
  ChevronFirstWhiteIcon,
  ChevronLastIcon,
  ChevronLastWhiteIcon,
  Logo,
  LogoWhite,
} from "@icons"
import { useTheme } from "@providers"
import PropTypes from "prop-types"

export default function Sidebar({ items }) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [expanded, setExpanded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)

  const [sidebarHeight, setSidebarHeight] = useState("100vh")

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY
      setSidebarHeight(`${640 + scrollTop}px`)
    })
  }, [])

  return (
    <aside>
      <nav
        className="bg-blue-20 dark:bg-blue-80 inline-flex flex-col justify-between overflow-auto border-r shadow-sm"
        style={{ height: sidebarHeight }}
      >
        <div>
          <div className="flex items-center justify-between p-4 pb-2">
            <div onClick={() => navigate("/")}>
              <img
                src={theme === dark ? LogoWhite : Logo}
                className={`cursor-pointer overflow-hidden transition-all ${
                  expanded ? "w-13 h-10" : "w-0"
                }`}
                alt="Logo"
              />
              <p
                className={`text-primary m-0 text-xs font-bold ${!expanded && "hidden"}`}
              >
                Admin Panel
              </p>
            </div>
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="hover:bg-border bg-accent rounded-lg p-1.5"
            >
              {expanded ? (
                <img
                  src={
                    theme === dark ? ChevronFirstWhiteIcon : ChevronFirstIcon
                  }
                  alt="Chevron First Icon"
                  width={20}
                  height={20}
                />
              ) : (
                <img
                  src={theme === dark ? ChevronLastWhiteIcon : ChevronLastIcon}
                  alt="Chevron Last Icon"
                  width={20}
                  height={20}
                />
              )}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">
              {items.map((item, index) => (
                <SidebarItem
                  key={index}
                  theme={theme}
                  active={activeIndex === index}
                  onClick={() => setActiveIndex(index)}
                  {...item}
                />
              ))}
            </ul>
          </SidebarContext.Provider>
        </div>

        <div className="flex border-t p-3">
          <img
            src="https://ui-avatars.com/api/?name=admin"
            alt=""
            className="h-10 w-10 rounded-md"
          />
          <div
            className={`flex items-center justify-between overflow-hidden transition-all ${
              expanded ? "ml-3 w-52" : "w-0"
            } `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Admin</h4>
              <span className="text-xs text-gray-600">admin@dashbite.com</span>
            </div>

            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </nav>
    </aside>
  )
}

const SidebarItem = ({
  icon,
  iconDark,
  iconName,
  text,
  alert,
  link,
  theme,
  active,
  onClick,
}) => {
  const { expanded } = useContext(SidebarContext)
  const navigate = useNavigate()

  const handleClick = () => {
    onClick()
    navigate(link)
  }

  return (
    <li
      className={`hover:bg-blue-30 dark:hover:bg-blue-90 group relative my-1 flex cursor-pointer items-center rounded-md px-3 py-2 font-medium transition-colors ${
        active && "bg-blue-30 dark:bg-blue-90"
      }`}
      onClick={handleClick}
    >
      <img
        src={theme === dark ? iconDark : icon}
        alt={iconName}
        width={20}
        height={20}
      />
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "ml-3 w-52" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`bg-blue-40 dark:bg-blue-70 absolute right-2 h-2 w-2 rounded ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`text-blue-60 bg-blue-10 dark:bg-blue-80 invisible absolute left-full ml-6 -translate-x-3 rounded-md px-2 py-1 text-sm opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
        >
          {text}
        </div>
      )}
    </li>
  )
}

Sidebar.propTypes = {
  theme: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired,
      iconDark: PropTypes.node,
      iconName: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      alert: PropTypes.bool,
    })
  ).isRequired,
}

SidebarItem.propTypes = {
  icon: PropTypes.node.isRequired,
  iconDark: PropTypes.node,
  iconName: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  alert: PropTypes.bool,
  theme: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
}
