import {
  Beverages,
  Breakfast,
  Burgers,
  Desserts,
  Pizza,
  Seafood,
  Snacks,
  Soups,
} from "@img"

export const ButtonVariants = {
  variant: {
    default: "bg-primary text-white shadow hover:bg-primary/85",
    destructive:
      "bg-destructive text-background shadow-sm hover:bg-destructive/85",
    outline:
      "border rounded border-input bg-background shadow-sm hover:bg-accent hover:text-foreground",
    accent: "bg-accent text-foreground shadow-sm hover:bg-accent/85",
    ghost: "rounded hover:bg-accent/80 hover:text-foreground",
    link: "text-primary hover:text-primary/85 underline-offset-4 hover:underline",
    success:
      "bg-green-600 text-background shadow-sm hover:bg-green/85 shadow-green-400/40",
  },
  size: {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-5 w-9",
  },
}

export const navbarLinks = [
  { href: "#", label: "Home" },
  { href: "#", label: "Menu" },
  { href: "#", label: "About" },
  { href: "#", label: "Contact" },
]

export const categoryLinks = [
  { label: "Breakfast", image: Breakfast },
  { label: "Beverages", image: Beverages },
  { label: "Pizza", image: Pizza },
  { label: "Burgers", image: Burgers },
  { label: "Seafood", image: Seafood },
  { label: "Snacks", image: Snacks },
  { label: "Soups", image: Soups },
  { label: "Desserts", image: Desserts },
]
