import { Router } from "express"
import authRoutes from "./auth.routes.js"
import productsRoutes from "./products.routes.js"
import ordersRoutes from "./orders.routes.js"
import heroRoutes from "./hero.routes.js"

const router = Router()

router.get("/health", (_req, res) =>
  res.json({ success: true, message: "API OK", timestamp: new Date().toISOString() })
)

router.use("/auth", authRoutes)
router.use("/products", productsRoutes)
router.use("/orders", ordersRoutes)
router.use("/hero", heroRoutes)

export default router
