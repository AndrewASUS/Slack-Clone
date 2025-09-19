import "../instrument.mjs"
import express from "express"
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js"
import { clerkMiddleware } from "@clerk/express"
import { functions, inngest } from "./config/inngest.js"
import { serve } from "inngest/express"
import chatRoutes from "./routes/chat.route.js"
import * as Sentry from "@sentry/node"



const app = express()

app.use(express.json()) // Allows req.body JSON data 
app.use(clerkMiddleware()) // Can't check if user is authenticated without this (req.auth)


app.get("/debug-sentry", (req, res) => {
  throw new Error("Sentry error testing!")
})

app.get("/", (req, res) => {
  res.send("🚀 Server response")
})


app.use("/api/inngest", serve({ client: inngest, functions }))
app.use("/api/chat", chatRoutes)

Sentry.setupExpressErrorHandler(app)





// Server configuration for vercel configuration
const startServer = async () => {
  try {
    await connectDB()
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log("Server running on PORT: ", ENV.PORT)
      })
    }
  } catch (error) {
    console.error("Error starting server:", error)
    process.exit(1)
  }
}


startServer()

export default app
