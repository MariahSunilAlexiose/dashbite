# DashBite

DashBite is a dynamic food delivery platform that connects restaurants and customers seamlessly. Built with a modern frontend using ReactJS and powered by a Node.js backend, DashBite ensures a fast, responsive, and user-friendly experience for ordering and managing food deliveries.

## Features & Architecture

DashBite is structured into three main components:

### Frontend (ReactJS)
The frontend provides an intuitive interface for users to browse menus, place orders, and track their deliveries in real time. It is fully responsive and designed with modern UI principles.

#### Key Features:
- *User Authentication* – Secure login and registration
- *Menu Browsing* – Explore restaurant categories and dishes
- *Order Management* – Place and track orders seamlessly
- *Review System* – Customers can leave ratings and feedback

To start the frontend:
```
cd frontend
yarn
```

### Backend (Node.js & Express.js)
The backend manages core functionalities such as authentication, order processing, and restaurant management. It connects to a MongoDB database for handling persistent data and ensures seamless operations between users and restaurants.

#### Key Features:
- *Authentication & Authorization* – Secure login for users and admin access
- *Order Processing* – Placing, tracking, and managing food orders
- *Restaurant & Dish Management* – CRUD operations for restaurants, dishes, and categories
- *Review System* – Users can add and manage reviews for dishes and restaurants
- *Error Handling & Security* – Implements robust validation and error-handling mechanisms

To start the backend server:
```
cd backend
yarn server
```

### Admin Dashboard
The admin panel enables administrators to manage operations efficiently, ensuring smooth coordination between restaurants and customers.

#### Key Features:
- *Restaurant Management* – Add, update, and delete restaurant profiles
- *Dish Management* – Manage menus and categories
- *Order Oversight* – View and process customer orders
- *User Reviews* – Monitor feedback and ratings

## Figma

### [View the Prototype](https://www.figma.com/proto/ePJKy9WwFZHbdFNJD9kmaT/DashBite?node-id=6602-342&p=f&t=yZMku9DK7BFCsvJf-0&scaling=scale-down&content-scaling=responsive&page-id=4475%3A14&starting-point-node-id=6602%3A342)

This interactive prototype demonstrates the user flow and functionality of the application. It provides a visual representation of how users will navigate through the app, including transitions, interactions, and animations.

### [Access the Figma File](https://www.figma.com/design/ePJKy9WwFZHbdFNJD9kmaT/DashBite?m=auto&t=YnHTghYS1eQgZqYz-1)

The Figma file contains all the design assets, including components, high-fidelity screens, and style guides.

## Installation

1. Clone the repository

```
git clone https://github.com/MariahSunilAlexiose/dashbite.git
cd dashbite
```

2. Install dependencies

```
cd frontend
yarn
```

```
cd ..
cd backend
yarn
```

