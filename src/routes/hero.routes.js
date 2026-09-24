import { Router } from "express"
import { list, create, remove } from "../controllers/hero.controller.js"
import {
  authenticate,
  authorize,
} from "../middlewares/auth.middleware.js"
import { uploadImages } from "../middlewares/upload.middleware.js"

const router = Router()

// Público: imágenes del fondo del Home
router.get("/", list)

// Admin: subir (máximo 3 en total) y eliminar
router.post("/", authenticate, authorize("admin"), uploadImages, create)
router.delete("/:id", authenticate, authorize("admin"), remove)

export default router