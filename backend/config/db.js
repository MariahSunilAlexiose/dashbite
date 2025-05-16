import mongoose from "mongoose"

export const connectDB = async () => {
  await mongoose
    .connect(
      `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@backend.vrs86.mongodb.net/dashbite`
    )
    .then(() => console.log("Database connected!"))
}
