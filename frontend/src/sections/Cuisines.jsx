import React, { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, Skeleton } from "@cmp"
import { StoreContext } from "@context"
import {
  ArrowRightIcon,
  ChevronLeftWhiteIcon,
  ChevronRightWhiteIcon,
} from "@icons"

const Cuisines = () => {
  const { url, cuisines } = useContext(StoreContext)
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)

  const [loading, setLoading] = useState(true)

  const extendedCuisines = [...cuisines, ...cuisines] // Doubled list

  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current

    // When reaching the end, reset scroll position
    if (scrollLeft + clientWidth >= scrollWidth)
      scrollContainerRef.current.scrollLeft = 0

    // When scrolling back to the start, reset position
    if (scrollLeft <= 0) scrollContainerRef.current.scrollLeft = scrollWidth / 2
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) container.addEventListener("scroll", handleScroll)
    return () => container?.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  return (
    <div>
      {loading ? (
        <div className="flex justify-between gap-4">
          <Skeleton className="h-10 w-full max-w-[55vw] rounded" />
          <Skeleton className="h-10 w-20 rounded" />
        </div>
      ) : (
        <div className="flex justify-between">
          <div>
            <h2>Discover Bold Flavors</h2>
            <p className="max-w-[55vw] leading-5">
              Explore a variety of cuisines, from timeless classics to
              innovative creations. Every dish is crafted to delight your senses
              and elevate your dining experience.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="bg-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
              onClick={() => {
                if (scrollContainerRef.current)
                  scrollContainerRef.current.scrollBy({
                    left: -200, //scroll to left
                    behavior: "smooth",
                  })
              }}
            >
              <img
                className="h-8 w-8"
                src={ChevronLeftWhiteIcon}
                alt="Chevron Left Icon"
              />
            </div>

            <div
              className="bg-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
              onClick={() => {
                if (scrollContainerRef.current)
                  scrollContainerRef.current.scrollBy({
                    left: 200, //scroll to right
                    behavior: "smooth",
                  })
              }}
            >
              <img
                className="h-8 w-8"
                src={ChevronRightWhiteIcon}
                alt="Chevron Right Icon"
              />
            </div>
          </div>
        </div>
      )}
      <div>
        {loading ? (
          <Skeleton className="h-30 md:h-35 lg:h-50 mt-5 w-full rounded" />
        ) : (
          <div
            className="mt-6 flex gap-6 overflow-x-scroll"
            ref={scrollContainerRef}
          >
            {extendedCuisines.map((link) => (
              <div key={link._id}>
                <div className="md:h-35 md:w-35 h-30 w-30 lg:h-50 lg:w-50 group relative cursor-pointer items-center overflow-hidden rounded-3xl transition-shadow">
                  <div className="relative h-full w-full">
                    <img
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-125"
                      src={`${url}/images/${link.image}`}
                      alt={link.name}
                    />

                    {/* Background Overlay */}
                    <div className="absolute inset-0 bg-black/40 transition-all duration-500 group-hover:bg-black/20"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 flex w-full items-center justify-between p-4">
                    <h1 className="text-2xl font-bold text-white">
                      {link.name}
                    </h1>
                  </div>
                  <div className="absolute right-0 top-0 flex p-4">
                    <Button
                      variant="primary"
                      size="icon"
                      className="rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      onClick={() => navigate(`/cuisine/${link._id}`)}
                    >
                      <img
                        src={ArrowRightIcon}
                        alt="Arrow Right Icon"
                        className="h-4 w-4"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Cuisines
