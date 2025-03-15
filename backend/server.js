import cors from "cors"
import express from "express"

// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send("API is working!")
})

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
