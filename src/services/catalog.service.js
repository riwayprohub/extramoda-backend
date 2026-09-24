import prisma from "../config/prisma.js"
import { unlink } from "fs/promises"

// Con multipart todos los campos llegan como strings; Prisma espera que
// `stock` sea un número. Acá se normalizan los tipos antes de guardar.
function normalizeData(data) {
  const out = { ...data }

  if (out.price !== undefined && out.price !== null && out.price !== "") {
    out.price = String(out.price)
  }

  if (out.stock !== undefined && out.stock !== null && out.stock !== "") {
    const n = Number(out.stock)
    out.stock = Number.isNaN(n) ? undefined : n
  }

  if (out.featured !== undefined) {
    out.featured = out.featured === "true" || out.featured === true
  }

  return out
}

// El código es único en la BD. Si viene vacío, se genera uno automático
// para evitar el error de duplicado con strings vacíos.
function ensureCode(rawCode) {
  const code = String(rawCode || "").trim()
  return code || `SALVA-${Date.now()}`
}

// Borra los archivos subidos cuando falla la operación en la base de datos,
// para no dejar imágenes huérfanas en public/uploads.
async function removeUploadedFiles(files = []) {
  await Promise.all(files.map((f) => unlink(f.path).catch(() => {})))
}

export const getAllItems = async ({
  page = 1,
  category,
  badge,
  featured,
  search,
  pageSize = 12,
}) => {
  const skip = (Number(page) - 1) * pageSize

  const where = {}
  if (category) where.category = category
  if (badge) where.badge = badge
  if (featured) where.featured = true
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { code: { contains: search } },
    ]
  }

  const [items, total] = await Promise.all([
    prisma.catalogoItem.findMany({
      where,
      skip,
      take: Number(pageSize),
      orderBy: { createdAt: "desc" },
    }),
    prisma.catalogoItem.count({ where }),
  ])

  return {
    items,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      totalPages: Math.ceil(total / Number(pageSize)),
    },
  }
}

export const getItemById = async (id) => {
  const item = await prisma.catalogoItem.findUnique({ where: { id: Number(id) } })
  if (!item) {
    const err = new Error("Producto no encontrado")
    err.status = 404
    throw err
  }
  return item
}

export const createItem = async (data, files = []) => {
  const images = files.length
    ? files.map((f) => `/uploads/${f.filename}`)
    : data.images || []

  try {
    return await prisma.catalogoItem.create({
      data: {
        ...normalizeData(data),
        code: ensureCode(data.code),
        images,
      },
    })
  } catch (err) {
    await removeUploadedFiles(files)
    throw err
  }
}

export const updateItem = async (id, data, files = []) => {
  const existing = await prisma.catalogoItem.findUnique({
    where: { id: Number(id) },
  })
  if (!existing) {
    await removeUploadedFiles(files)
    const err = new Error("Producto no encontrado")
    err.status = 404
    throw err
  }

  const updateData = normalizeData(data)
  // Si el código viene vacío al editar, conservar el que ya tenía el producto
  if (!updateData.code || !String(updateData.code).trim()) {
    updateData.code = existing.code
  }

  // Si vienen archivos nuevos, reemplaza o añade a las imágenes existentes
  if (files.length) {
    const oldImages = existing.images || []
    updateData.images = [...oldImages, ...files.map((f) => `/uploads/${f.filename}`)]
  }

  try {
    return await prisma.catalogoItem.update({
      where: { id: Number(id) },
      data: updateData,
    })
  } catch (err) {
    await removeUploadedFiles(files)
    throw err
  }
}

export const deleteItem = async (id) => {
  const existing = await prisma.catalogoItem.findUnique({
    where: { id: Number(id) },
  })
  if (!existing) {
    const err = new Error("Producto no encontrado")
    err.status = 404
    throw err
  }
  await prisma.catalogoItem.delete({ where: { id: Number(id) } })
  return existing
}

export const getCategories = async () => {
  const groups = await prisma.catalogoItem.groupBy({
    by: ["category"],
    _count: { _all: true },
  })
  return groups
}
