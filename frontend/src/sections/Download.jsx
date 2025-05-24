import React, { useEffect, useState } from "react"

import { Skeleton } from "@cmp"
import { AppStore, PlayStore } from "@img"

const Download = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])
  return (
    <div>
      {loading ? (
        <Skeleton className="h-30 w-full rounded p-1" />
      ) : (
        <div className="flex flex-col gap-8 text-center">
          <div>
            <h2 className="text-4xl font-semibold tracking-[2%]">
              For Better Experience Download <br /> DashBite App
            </h2>
          </div>
          <div className="flex justify-center gap-20">
            <img src={PlayStore} alt="Play Store Download" />
            <img src={AppStore} alt="App Store Download" />
          </div>
        </div>
      )}
    </div>
  )
}

export default Download
