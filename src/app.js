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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://riwayprohub.github.io"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS no permitido"));
    }
  },
  credentials: true
}))
app.use(express.json())
app.use(morgan("dev"))

// Servir las imágenes subidas del catálogo en /uploads
app.use("/uploads", express.static(uploadsDir))

app.use("/api", routes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
