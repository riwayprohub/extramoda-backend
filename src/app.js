import express from "express"
import cors from "cors"
import morgan from "morgan"
import config from "./config/index.js"
import routes from "./routes/index.js"
import { uploadsDir } from "./middlewares/upload.middleware.js"
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler.middleware.js"

const app = express()

app.use(cors({ origin: config.clientUrl, credentials: true }))
app.use(express.json())
app.use(morgan("dev"))

// Servir las imágenes subidas del catálogo en /uploads
app.use("/uploads", express.static(uploadsDir))

app.use("/api", routes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
