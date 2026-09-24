import path from "path"
import { unlink } from "fs/promises"
import { uploadsDir } from "../middlewares/upload.middleware.js"
import {
  getHeroImages,
  createHeroImages,
  deleteHeroImage,
  MAX_HERO_IMAGES,
} from "../services/hero.service.js"
import { success, error } from "../utils/apiResponse.js"

async function cleanupFiles(files) {
  await Promise.all(files.map((f) => unlink(path.join(uploadsDir, f.filename)).catch(() => {})))
}

export const list = async (_req, res, next) => {
  try {
    const images = await getHeroImages()
    return success(res, { images }, "Imágenes del Home")
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  const files = req.files || []
  try {
    if (!files.length) {
      return error(res, "Seleccioná al menos una imagen", 400)
    }
    if (files.length > MAX_HERO_IMAGES) {
      await cleanupFiles(files)
      return error(res, `Solo se permiten ${MAX_HERO_IMAGES} imágenes como máximo`, 400)
    }

    const current = await getHeroImages()
    const available = MAX_HERO_IMAGES - current.length
    if (available <= 0 || files.length > available) {
      await cleanupFiles(files)
      return error(
        res,
        `Solo quedan ${Math.max(available, 0)} espacio(s) libre(s) de ${MAX_HERO_IMAGES}`,
        400
      )
    }

    const created = await createHeroImages(files)
    return success(res, { images: created }, "Imágenes del Home guardadas", 201)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    const removed = await deleteHeroImage(req.params.id)
    return success(res, { image: removed }, "Imagen del Home eliminada")
  } catch (err) {
    next(err)
  }
}