import { createContext } from "react"

import { dishes } from "@/constants"

export const store = { dishes }
export const StoreContext = createContext(null)
