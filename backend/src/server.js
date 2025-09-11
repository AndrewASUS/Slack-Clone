import express from "express"
import { ENV } from "./config/env.js"


const app = express()


console.log("Mongo uri", ENV.MONGO_URI)


app.get("/", (req, res) => {
  res.send("🚀 Server response")
})


app.listen(ENV.PORT, () => {
  console.log("Server is running on PORT :" + ENV.PORT )
})