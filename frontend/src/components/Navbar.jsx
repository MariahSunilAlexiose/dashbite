import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, ThemeToggle } from "@cmp"
import { dark, light, StoreContext } from "@context"
import {
  Bars3Icon,
  Bars3WhiteIcon,
  MagnifyingGlassBlackIcon,
  MagnifyingGlassWhiteIcon,
  ShoppingCartBlackIcon,
  ShoppingCartWhiteIcon,
  XMarkIcon,
  XMarkWhiteIcon,
} from "@icons"
import { LogoBlue, LogoWhite } from "@img"
import { useTheme } from "@providers"
import PropTypes from "prop-types"

import { navbarLinks } from "@/constants"

const MobileNavBar = ({ setMobileMenu, theme, navigate, cartItems }) => (
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
          {navbarLinks.map((link, index) => (
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
          <div className="flex items-center justify-center">
            <div className="relative">
              <img
                src={
                  theme === dark ? ShoppingCartWhiteIcon : ShoppingCartBlackIcon
                }
                alt="Shopping Cart Icon"
                width={24}
                height={24}
                className="cursor-pointer"
                onClick={() => navigate("/cart")}
              />
              {Object.keys(cartItems).length > 0 && (
                <div
                  className="bg-red-90 absolute right-0 top-0 h-2 w-2 rounded-full"
                  style={{ transform: "translate(50%, -50%)" }}
                />
              )}
            </div>
          </div>
          <Button className="rounded-full!">Login</Button>
        </div>
      </div>
    </div>
  </div>
)

MobileNavBar.propTypes = {
  setMobileMenu: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
  cartItems: PropTypes.object.isRequired,
}

const Navbar = () => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenu, setMobileMenu] = useState(false)
  const [activeLink, setActiveLink] = useState("")
  const { cartItems } = useContext(StoreContext)

  return (
    <header>
      <nav
        className="mx-auto mt-6 flex max-w-7xl items-center justify-between"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">DashBite</span>
            <img
              className="h-18 w-auto"
              src={theme === light ? LogoBlue : LogoWhite}
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
          {navbarLinks.map((link, index) => (
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
            <div className="flex items-center justify-center">
              <div className="relative">
                <img
                  src={
                    theme === dark
                      ? ShoppingCartWhiteIcon
                      : ShoppingCartBlackIcon
                  }
                  alt="Shopping Cart Icon"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                  onClick={() => navigate("/cart")}
                />
                {Object.keys(cartItems).length > 0 && (
                  <div
                    className="bg-red-90 absolute right-0 top-0 h-2 w-2 rounded-full"
                    style={{ transform: "translate(50%, -50%)" }}
                  />
                )}
              </div>
            </div>
          </div>
          <Button onClick={() => navigate("/login")} className="rounded-full!">
            Login
          </Button>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </nav>
      {mobileMenu && (
        <MobileNavBar
          setMobileMenu={setMobileMenu}
          theme={theme}
          navigate={navigate}
          cartItems={cartItems}
        />
      )}
    </header>
  )
}

export default Navbar
