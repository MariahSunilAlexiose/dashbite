import {
  ArrowLeftStartOnRectangleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FacebookIcon,
  InformationCircleIcon,
  LinkedinIcon,
  Rating1Icon,
  Rating2Icon,
  Rating3Icon,
  Rating4Icon,
  Rating5Icon,
  ShoppingBagIcon,
  TwitterXIcon,
  UserIcon,
} from "@icons"
import {
  ApplePie,
  BaconBurger,
  BagelCreamCheese,
  BbqChickenPizza,
  Beverages,
  Breakfast,
  Brownies,
  Burgers,
  CheeseBurger,
  Cheesecake,
  ChickenBurger,
  ChickenNoodleSoup,
  ChipsDip,
  ChocolateCake,
  Coffee,
  Desserts,
  FishChips,
  FrenchToast,
  GrilledSalmon,
  HawaiianPizza,
  IceCreamSundae,
  IcedTea,
  LentilSoup,
  LobsterTail,
  MargheritaPizza,
  Milkshake,
  Minestrone,
  MushroomSoup,
  MushroomSwissBurger,
  Nachos,
  Omelette,
  OrangeJuice,
  Pancakes,
  PepperoniPizza,
  Pizza,
  Popcorn,
  Pretzels,
  Seafood,
  SeafoodPlatter,
  ShrimpCocktail,
  Snacks,
  Soups,
  SparklingWater,
  SpringRolls,
  TomatoSoup,
  VeggieBurger,
  VeggiePizza,
  Waffles,
} from "@img"
import axios from "axios"

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

export const ratings = [
  {
    label: "Ratings 1",
    image: Rating1Icon,
    number: 1,
  },
  {
    label: "Ratings 2",
    image: Rating2Icon,
    number: 2,
  },
  {
    label: "Ratings 3",
    image: Rating3Icon,
    number: 3,
  },
  {
    label: "Ratings 4",
    image: Rating4Icon,
    number: 4,
  },
  {
    label: "Ratings 5",
    image: Rating5Icon,
    number: 5,
  },
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

export const popoverItems = [
  { href: "/profile", name: "Profile", icon: UserIcon },
  { href: "/myorders", name: "Orders", icon: ShoppingBagIcon },
  { href: "#", name: "Logout", icon: ArrowLeftStartOnRectangleIcon },
]

export const dishes = [
  // Breakfast
  {
    _id: 1,
    image: Pancakes,
    name: "Pancakes",
    rating: 4,
    description: "Fluffy pancakes served with syrup and butter.",
    price: 8,
    category: "Breakfast",
  },
  {
    _id: 2,
    image: Waffles,
    name: "Waffles",
    rating: 5,
    description: "Crispy waffles topped with whipped cream and berries.",
    price: 9,
    category: "Breakfast",
  },
  {
    _id: 3,
    image: Omelette,
    name: "Omelette",
    rating: 4,
    description: "Egg omelette with cheese, spinach, and mushrooms.",
    price: 7,
    category: "Breakfast",
  },
  {
    _id: 4,
    image: BagelCreamCheese,
    name: "Bagel and Cream Cheese",
    rating: 4,
    description: "Toasted bagel with creamy cheese spread.",
    price: 5,
    category: "Breakfast",
  },
  {
    _id: 5,
    image: FrenchToast,
    name: "French Toast",
    rating: 5,
    description: "Golden-brown French toast with maple syrup.",
    price: 5,
    category: "Breakfast",
  },

  // Beverages
  {
    _id: 6,
    image: OrangeJuice,
    name: "Orange Juice",
    rating: 4,
    description: "Freshly squeezed orange juice packed with vitamin C.",
    price: 5,
    category: "Beverages",
  },
  {
    _id: 7,
    image: Coffee,
    name: "Coffee",
    rating: 5,
    description: "Rich and aromatic brewed coffee.",
    price: 3,
    category: "Beverages",
  },
  {
    _id: 8,
    image: IcedTea,
    name: "Iced Tea",
    rating: 4,
    description: "Refreshing iced tea with a hint of lemon.",
    price: 4,
    category: "Beverages",
  },
  {
    _id: 9,
    image: Milkshake,
    name: "Milkshake",
    rating: 5,
    description: "Creamy and delicious milkshake in various flavors.",
    price: 6,
    category: "Beverages",
  },
  {
    _id: 10,
    image: SparklingWater,
    name: "Sparkling Water",
    rating: 3,
    description: "Bubbly and refreshing sparkling water.",
    price: 2,
    category: "Beverages",
  },

  // Pizza
  {
    _id: 11,
    image: MargheritaPizza,
    name: "Margherita Pizza",
    rating: 5,
    description:
      "A delightful classic pizza with a tangy tomato base and melted cheese.",
    price: 19,
    category: "Pizza",
  },
  {
    _id: 12,
    image: PepperoniPizza,
    name: "Pepperoni Pizza",
    rating: 4,
    description: "Savory pepperoni slices atop a cheesy pizza base.",
    price: 18,
    category: "Pizza",
  },
  {
    _id: 13,
    image: BbqChickenPizza,
    name: "BBQ Chicken Pizza",
    rating: 5,
    description: "Topped with smoky BBQ chicken and red onions.",
    price: 20,
    category: "Pizza",
  },
  {
    _id: 14,
    image: HawaiianPizza,
    name: "Hawaiian Pizza",
    rating: 3,
    description: "A tropical twist with ham and pineapple.",
    price: 19,
    category: "Pizza",
  },
  {
    _id: 15,
    image: VeggiePizza,
    name: "Veggie Pizza",
    rating: 4,
    description: "Loaded with fresh vegetables and mozzarella cheese.",
    price: 16,
    category: "Pizza",
  },

  // Burgers
  {
    _id: 16,
    image: CheeseBurger,
    name: "Cheeseburger",
    rating: 5,
    description: "Juicy beef patty with melted cheese in a soft bun.",
    price: 10,
    category: "Burgers",
  },
  {
    _id: 17,
    image: ChickenBurger,
    name: "Chicken Burger",
    rating: 4,
    description: "Crispy chicken fillet with lettuce and mayo.",
    price: 9,
    category: "Burgers",
  },
  {
    _id: 18,
    image: VeggieBurger,
    name: "Veggie Burger",
    rating: 4,
    description: "Plant-based patty with fresh toppings.",
    price: 8,
    category: "Burgers",
  },
  {
    _id: 19,
    image: BaconBurger,
    name: "Bacon Burger",
    rating: 5,
    description: "Beef burger topped with crispy bacon strips.",
    price: 12,
    category: "Burgers",
  },
  {
    _id: 20,
    image: MushroomSwissBurger,
    name: "Mushroom Swiss Burger",
    rating: 5,
    description: "Beef patty with sautéed mushrooms and Swiss cheese.",
    price: 11,
    category: "Burgers",
  },

  // Seafood
  {
    _id: 21,
    image: GrilledSalmon,
    name: "Grilled Salmon",
    rating: 5,
    description: "Tender salmon fillet grilled to perfection.",
    price: 22,
    category: "Seafood",
  },
  {
    _id: 22,
    image: FishChips,
    name: "Fish and Chips",
    rating: 4,
    description: "Crispy battered fish served with fries.",
    price: 15,
    category: "Seafood",
  },
  {
    _id: 23,
    image: ShrimpCocktail,
    name: "Shrimp Cocktail",
    rating: 4,
    description: "Chilled shrimp served with tangy cocktail sauce.",
    price: 12,
    category: "Seafood",
  },
  {
    _id: 24,
    image: SeafoodPlatter,
    name: "Seafood Platter",
    rating: 5,
    description: "An assortment of shrimp, scallops, and fish.",
    price: 28,
    category: "Seafood",
  },
  {
    _id: 25,
    image: LobsterTail,
    name: "Lobster Tail",
    rating: 5,
    description: "Succulent lobster tail with garlic butter.",
    price: 35,
    category: "Seafood",
  },

  // Snacks
  {
    _id: 26,
    image: ChipsDip,
    name: "Chips and Dip",
    price: 6,
    rating: 4,
    description: "Crispy chips served with a creamy dip.",
    category: "Snacks",
  },
  {
    _id: 27,
    image: Nachos,
    name: "Nachos",
    price: 10,
    rating: 5,
    description: "Loaded nachos with cheese, jalapeños, and salsa.",
    category: "Snacks",
  },
  {
    _id: 28,
    image: Popcorn,
    name: "Popcorn",
    price: 4,
    rating: 4,
    description: "Buttery popcorn, perfect for movie time.",
    category: "Snacks",
  },
  {
    _id: 29,
    image: Pretzels,
    name: "Pretzels",
    price: 3,
    rating: 3,
    description: "Soft and salty pretzels.",
    category: "Snacks",
  },
  {
    _id: 30,
    image: SpringRolls,
    name: "Spring Rolls",
    price: 8,
    rating: 5,
    description: "Crispy rolls filled with vegetables and chicken.",
    category: "Snacks",
  },

  // Soups
  {
    _id: 31,
    image: TomatoSoup,
    name: "Tomato Soup",
    price: 7,
    rating: 4,
    description: "Classic tomato soup with a hint of basil.",
    category: "Soups",
  },
  {
    _id: 32,
    image: ChickenNoodleSoup,
    name: "Chicken Noodle Soup",
    price: 9,
    rating: 5,
    description: "Hearty soup with chicken, noodles, and vegetables.",
    category: "Soups",
  },
  {
    _id: 33,
    image: MushroomSoup,
    name: "Mushroom Soup",
    price: 7,
    rating: 4,
    description: "Creamy soup with earthy mushrooms.",
    category: "Soups",
  },
  {
    _id: 34,
    image: LentilSoup,
    name: "Lentil Soup",
    price: 7,
    rating: 4,
    description: "Nutritious soup made with lentils and spices.",
    category: "Soups",
  },
  {
    _id: 35,
    image: Minestrone,
    name: "Minestrone",
    price: 10,
    rating: 5,
    description: "A vibrant Italian vegetable soup.",
    category: "Soups",
  },

  // Desserts
  {
    _id: 36,
    image: ChocolateCake,
    name: "Chocolate Cake",
    price: 7,
    rating: 5,
    description: "Rich and moist chocolate cake topped with creamy frosting.",
    category: "Desserts",
  },
  {
    _id: 37,
    image: ApplePie,
    name: "Apple Pie",
    price: 6,
    rating: 4,
    description: "Classic apple pie with a flaky crust and cinnamon filling.",
    category: "Desserts",
  },
  {
    _id: 38,
    image: IceCreamSundae,
    name: "Ice Cream Sundae",
    price: 8,
    rating: 5,
    description: "Vanilla ice cream topped with chocolate syrup and sprinkles.",
    category: "Desserts",
  },
  {
    _id: 39,
    image: Cheesecake,
    name: "Cheesecake",
    price: 9,
    rating: 5,
    description: "Creamy cheesecake with a graham cracker crust.",
    category: "Desserts",
  },
  {
    _id: 40,
    image: Brownies,
    name: "Brownies",
    price: 5,
    rating: 4,
    description: "Fudgy chocolate brownies with a hint of espresso.",
    category: "Desserts",
  },
]

export const icons = [
  { image: LinkedinIcon, alt: "Linkedin Icon" },
  { image: TwitterXIcon, alt: "Twitter X Icon" },
  { image: FacebookIcon, alt: "Facebook Icon" },
]

export const footerLinks = [
  {
    title: "Company",
    links: [
      { name: "About us", href: "/" },
      { name: "Contact Us", href: "/" },
      { name: "Careers", href: "/" },
      { name: "Press", href: "/" },
    ],
  },
  {
    title: "Help",
    links: [
      { name: "FAQs", href: "/" },
      { name: "How it works", href: "/" },
      { name: "Privacy policy", href: "/" },
    ],
  },
  {
    title: "Get in touch",
    links: [
      {
        name: "customerservice@dashbite.com",
        href: "mailto:customerservice@dashbite.com",
      },
      { name: "1-800-267-8097", href: "tel:18002678097" },
    ],
  },
]

export const shippingOptions = [
  {
    title: "Free shipping",
    value: "free_shipping",
    cost: "$0.00",
  },
  {
    title: "Express shipping",
    value: "express_shipping",
    cost: "+$15.00",
  },
  {
    title: "Pick up",
    value: "pick_up",
    cost: "%5.00",
  },
]

export const formatDate = (dateString) => {
  const options = { day: "numeric", month: "short", year: "numeric" }
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(dateString)
  )
  const [month, day, year] = formattedDate.replace(",", "").split(" ")
  return `${day} ${month} ${year}`
}

export const logout = ({ setToken, navigate }) => {
  localStorage.removeItem("token")
  setToken("")
  navigate("/")
}

export const getuser = async ({ url, userID, token, addToast }) => {
  try {
    if (!token) {
      return
    }
    const userRes = await axios.get(`${url}/api/user/${userID}`, {
      headers: { token },
    })
    if (!userRes.data.success) {
      addToast("error", "Error", `Error: ${userRes.data.message}`)
      return
    }
    return userRes.data.user
  } catch (err) {
    addToast("error", "Error", `Error in retrieving user: ${err}`)
  }
}
