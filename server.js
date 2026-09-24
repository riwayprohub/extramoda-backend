import app from "./src/app.js"
import config from "./src/config/index.js"

const server = app.listen(config.port, () => {
  console.log(`🚀 API SalvaStyle corriendo en http://localhost:${config.port}`)
})

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err)
  server.close(() => process.exit(1))
})

process.on("SIGTERM", () => {
  console.log("SIGTERM recibido, cerrando servidor...")
  server.close(() => process.exit(0))
})
