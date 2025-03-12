import React from "react"

import { AppStore, PlayStore } from "@img"

const Download = () => {
  return (
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
  )
}

export default Download
