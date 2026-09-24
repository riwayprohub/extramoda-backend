import { Router } from "express"
import { create, mine, all, updateStatus } from "../controllers/orders.controller.js"
import { authenticate, authorize } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/", authenticate, create)
router.get("/mine", authenticate, mine)

router.get("/", authenticate, authorize("admin"), all)
router.put("/:id/status", authenticate, authorize("admin"), updateStatus)

export default router
