import { Router } from "express"
import {
  list,
  show,
  create,
  update,
  remove,
  categories,
} from "../controllers/products.controller.js"
import {
  authenticate,
  authorize,
} from "../middlewares/auth.middleware.js"
import { uploadImages } from "../middlewares/upload.middleware.js"

const router = Router()

// Públicos
router.get("/", list)
router.get("/categories", categories)
router.get("/:id", show)

// Admin (requieren autenticación y rol admin)
router.post("/", authenticate, authorize("admin"), uploadImages, create)
router.put("/:id", authenticate, authorize("admin"), uploadImages, update)
router.delete("/:id", authenticate, authorize("admin"), remove)

export default router
