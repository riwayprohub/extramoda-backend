import path from "path"
import prisma from "../config/prisma.js"
import { unlink } from "fs/promises"
import { uploadsDir } from "../middlewares/upload.middleware.js"

// Máximo de imágenes permitidas en el fondo negro del Home
export const MAX_HERO_IMAGES = 3

async function removeUploadedFiles(files = []) {
  await Promise.all(files.map((f) => unlink(f.path).catch(() => {})))
}

export const getHeroImages = async () => {
  return prisma.heroImage.findMany({
    orderBy: { id: "asc" },
  })
}

export const createHeroImages = async (files = []) => {
  const urls = files.map((f) => `/uploads/${f.filename}`)
  try {
    return await prisma.$transaction(
      urls.map((image) =>
        prisma.heroImage.create({ data: { image } })
      )
    )
  } catch (err) {
    await removeUploadedFiles(files)
    throw err
  }
}

export const deleteHeroImage = async (id) => {
  const existing = await prisma.heroImage.findUnique({
    where: { id: Number(id) },
  })
  if (!existing) {
    const err = new Error("Imagen del Home no encontrada")
    err.status = 404
    throw err
  }
  await prisma.heroImage.delete({ where: { id: Number(id) } })
  await removeUploadedFiles([{ path: path.join(uploadsDir, path.basename(existing.image)) }])
  return existing
}