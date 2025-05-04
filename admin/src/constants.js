import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShoppingCartIcon,
  ShoppingCartWhiteIcon,
  UserIcon,
  UserWhiteIcon,
  UtensilsCrossedIcon,
  UtensilsCrossedWhiteIcon,
} from "@icons"

export const backendURL = "http://localhost:4000/api"

export const backendImgURL = "http://localhost:4000/images"

export const sidebarItems = [
  {
    icon: UtensilsCrossedIcon,
    iconDark: UtensilsCrossedWhiteIcon,
    iconName: "Utensils Crossed Icon",
    text: "Dishes",
    alert: true,
    link: "/dishes",
  },
  {
    icon: ShoppingCartIcon,
    iconDark: ShoppingCartWhiteIcon,
    iconName: "Shopping Cart Icon",
    text: "Orders",
    link: "/orders",
  },
  {
    icon: UserIcon,
    iconDark: UserWhiteIcon,
    iconName: "User Icon",
    text: "Users",
    link: "/users",
  },
]

export const ButtonVariants = {
  variant: {
    default: "bg-primary text-white shadow hover:bg-primary/85",
    destructive:
      "bg-destructive text-background shadow-sm hover:bg-destructive/85",
    outline:
      "border rounded border-muted bg-background shadow-sm hover:bg-accent hover:text-foreground",
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

export const categories = [
  "Breakfast",
  "Beverages",
  "Pizza",
  "Burgers",
  "Seafood",
  "Snacks",
  "Soups",
  "Desserts",
]

export const ToastVariants = {
  success: {
    styles: "bg-green-300 text-green-800",
    title: "Success",
    description: "This action has been successfully implemented!",
    icon: { img: CheckCircleIcon, name: "Check Circle Icon" },
  },
  error: {
    styles: "bg-red-300 text-red-800",
    title: "Action Failed",
    description: "This action has failed!",
    icon: { img: ExclamationTriangleIcon, name: "Exclamation Circle Icon" },
  },
  info: {
    styles: "bg-blue-300 text-blue-800",
    icon: { img: InformationCircleIcon, name: "Information Circle Icon" },
  },
}

export const keyMapping = {
  name: "Name",
  description: "Description",
  price: "Price",
  category: "Category",
  rating: "Rating",
  userID: "User ID",
  amount: "Amount",
  status: "Status",
  date: "Date",
  payment: "Payment Status",
  deliveryType: "Delivery Type",
  items: "Items",
  quantity: "Quantity",
  subtotal: "Subtotal",
  email: "Email",
  shippingAddress: "Shipping Address",
  billingAddress: "Billing Address",
}

export const formatDate = (dateString) => {
  const options = { day: "numeric", month: "short", year: "numeric" }
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(dateString)
  )
  const [month, day, year] = formattedDate.replace(",", "").split(" ")
  return `${day} ${month} ${year}`
}

export const payment = ["Not Paid", "Paid"]

export const deliveryType = ["Free Shipping", "Express Shipping", "Pick Up"]

export const orderStatus = ["Dish Processing...", "Shipped", "Delivered Up"]
