import React, { useState } from "react"

import { Button } from "@cmp"
import { dark, light } from "@context"
import {
  Bars3Icon,
  Bars3WhiteIcon,
  MagnifyingGlassBlackIcon,
  MagnifyingGlassWhiteIcon,
  MoonIcon,
  ShoppingCartBlackIcon,
  ShoppingCartWhiteIcon,
  SunIcon,
  XMarkIcon,
  XMarkWhiteIcon,
} from "@icons"
import { logoBlue, logoWhite } from "@img"
import { useTheme } from "@providers"
import PropTypes from "prop-types"

const links = [
  { href: "#", label: "Home" },
  { href: "#", label: "Menu" },
  { href: "#", label: "About" },
  { href: "#", label: "Contact" },
]

const MobileNavBar = ({ setMobileMenu, theme }) => (
  <div className="lg:hidden">
    <div className="fixed inset-0 z-10" />
    <div className="bg-background sm:ring-border fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1">
      <div className="flex items-center justify-end">
        <button
          type="button"
          className="-m-2.5 cursor-pointer rounded-md p-2.5 text-gray-700"
          onClick={() => setMobileMenu(false)}
        >
          <span className="sr-only">Close menu</span>
          <img
            src={theme === dark ? XMarkWhiteIcon : XMarkIcon}
            alt="Close Icon"
            className="h-6 w-6"
            aria-hidden="true"
          />
        </button>
      </div>
      <div className="mt-6 flow-root">
        <div className="space-y-2">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-foreground hover:bg-accent -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="-mx-3 flex content-center justify-between px-3 py-2">
          <img
            src={theme === dark ? ShoppingCartWhiteIcon : ShoppingCartBlackIcon}
            alt="Shopping Cart Icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
          <Button className="rounded-full!">Login</Button>
        </div>
      </div>
    </div>
  </div>
)

MobileNavBar.propTypes = {
  setMobileMenu: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
}

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const [mobileMenu, setMobileMenu] = useState(false)
  const [activeLink, setActiveLink] = useState("")
  const toggleTheme = () => {
    setTheme(theme === dark ? light : dark)
  }

  return (
    <header>
      <nav
        className="mx-auto my-6 flex max-w-7xl items-center justify-between px-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">DashBite</span>
            <img
              className="h-18 w-auto"
              src={theme === light ? logoBlue : logoWhite}
              alt="DashBite Logo"
              width={10}
              height={10}
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <img
              src={theme === dark ? Bars3WhiteIcon : Bars3Icon}
              alt="Bars3 Icon"
              className="h-6 w-6 cursor-pointer"
              aria-hidden="true"
              onClick={() => setMobileMenu(!mobileMenu)}
            />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-foreground relative text-sm font-semibold leading-6"
              onClick={() => setActiveLink(link.label)}
            >
              {link.label}
              {activeLink === link.label && (
                <span className="bg-primary absolute bottom-[-2px] left-0 h-1 w-full rounded-full" />
              )}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-4">
          <div className="flex content-center gap-4">
            <img
              src={
                theme === dark
                  ? MagnifyingGlassWhiteIcon
                  : MagnifyingGlassBlackIcon
              }
              alt="Magnifying Glass Icon"
              width={24}
              height={24}
              className="cursor-pointer"
            />
            <img
              src={
                theme === dark ? ShoppingCartWhiteIcon : ShoppingCartBlackIcon
              }
              alt="Shopping Cart Icon"
              width={24}
              height={24}
              className="cursor-pointer"
            />
          </div>
          <Button className="rounded-full!">Login</Button>
          <div
            onClick={toggleTheme}
            className="cursor-pointer content-center"
            style={{ transition: "background 0.3s ease-in-out" }}
          >
            <img
              src={theme === dark ? SunIcon : MoonIcon}
              alt="Sun Icon"
              width={24}
              height={24}
            />
          </div>
        </div>
      </nav>
      {mobileMenu && (
        <MobileNavBar setMobileMenu={setMobileMenu} theme={theme} />
      )}
    </header>
  )
}

export default Navbar
