import prisma from "../config/prisma.js"
import slugify from "../utils/slugify.js"

const PAGE_SIZE = 12

export const getAllProducts = async ({ page = 1, category, min, max, search }) => {
  const skip = (Number(page) - 1) * PAGE_SIZE

  const where = {}
  if (category) where.category = category
  if (min) where.price = { ...where.price, gte: Number(min) }
  if (max) where.price = { ...where.price, lte: Number(max) }
  if (search) where.name = { contains: search }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    pagination: {
      page: Number(page),
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
    },
  }
}

export const getProductBySlug = async (slug) => {
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) {
    const err = new Error("Producto no encontrado")
    err.status = 404
    throw err
  }
  return product
}

export const createProduct = async (data) => {
  const slug = slugify(data.name)
  return prisma.product.create({ data: { ...data, slug } })
}

export const updateProduct = async (id, data) => {
  const product = await prisma.product.findUnique({ where: { id: Number(id) } })
  if (!product) {
    const err = new Error("Producto no encontrado")
    err.status = 404
    throw err
  }

  const updateData = { ...data }
  if (data.name) updateData.slug = slugify(data.name)

  return prisma.product.update({ where: { id: Number(id) }, data: updateData })
}

export const deleteProduct = async (id) => {
  const product = await prisma.product.findUnique({ where: { id: Number(id) } })
  if (!product) {
    const err = new Error("Producto no encontrado")
    err.status = 404
    throw err
  }
  await prisma.product.delete({ where: { id: Number(id) } })
  return product
}

export const getCategories = async () => {
  return prisma.product.findMany({
    distinct: ["category"],
    select: { category: true },
  })
}
