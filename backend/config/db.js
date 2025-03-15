import mongoose from "mongoose"

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://admin:b3ujppLApcJ4NKA5@backend.vrs86.mongodb.net/dashbite"
    )
    .then(() => console.log("Database connected!"))
}
