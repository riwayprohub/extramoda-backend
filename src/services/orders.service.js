import prisma from "../config/prisma.js"

export const createOrder = async (userId, { items, shipping, payment }) => {
  if (!items || !items.length) {
    const err = new Error("El pedido debe incluir al menos un producto")
    err.status = 400
    throw err
  }

  let total = 0
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    })
    if (!product) {
      const err = new Error(`Producto ${item.productId} no encontrado`)
      err.status = 404
      throw err
    }
    if (product.stock < item.quantity) {
      const err = new Error(`Stock insuficiente para ${product.name}`)
      err.status = 400
      throw err
    }
    total += Number(product.price) * item.quantity
  }

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: "pending",
      items: items,
      shipping,
      payment,
    },
  })

  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    })
  }

  return order
}

export const getMyOrders = async (userId) => {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}

export const getAllOrders = async () => {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } } },
  })
}

export const updateOrderStatus = async (id, { status }) => {
  const order = await prisma.order.findUnique({ where: { id: Number(id) } })
  if (!order) {
    const err = new Error("Pedido no encontrado")
    err.status = 404
    throw err
  }
  return prisma.order.update({ where: { id: Number(id) }, data: { status } })
}
