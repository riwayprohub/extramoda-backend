import bcrypt from "bcryptjs"
import prisma from "../src/config/prisma.js"

const img = (seed, w = 600, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

async function main() {
  const password = await bcrypt.hash("admin123", 10)

  await prisma.user.upsert({
    where: { email: "admin@salvastyle.com" },
    update: {},
    create: {
      email: "admin@salvastyle.com",
      password,
      name: "Admin SalvaStyle",
      role: "admin",
    },
  })

  await prisma.user.upsert({
    where: { email: "cliente@salvastyle.com" },
    update: {},
    create: {
      email: "cliente@salvastyle.com",
      password: await bcrypt.hash("cliente123", 10),
      name: "Cliente Demo",
      role: "user",
    },
  })

  const items = [
    {
      code: "JEAN-001",
      name: "Jean Slim Fit Azul",
      price: 28000,
      category: "Pantalones",
      badge: "new",
      description: "Jean slim fit tiro medio, 98% algodón y 2% elastano.",
      images: [img("jeans1")],
      stock: 50,
      featured: true,
    },
    {
      code: "JEAN-002",
      name: "Jean Baggy Negro",
      price: 29000,
      category: "Pantalones",
      badge: "",
      description: "Jean baggy tiro bajo, corte holgado y estilo urbano.",
      images: [img("jeans2")],
      stock: 40,
      featured: true,
    },
    {
      code: "JEAN-003",
      name: "Jean Flare Celeste",
      price: 27500,
      category: "Pantalones",
      badge: "",
      description: "Jean flare tiro bajo, efecto campana.",
      images: [img("jeans3")],
      stock: 35,
      featured: false,
    },
    {
      code: "POLL-001",
      name: "Mini Pollera Denim Azul",
      price: 19500,
      category: "Polleras",
      badge: "oferta",
      description: "Mini pollera de jean tiro bajo con botones.",
      images: [img("pollera1")],
      stock: 30,
      featured: true,
    },
    {
      code: "SHO-001",
      name: "Short Denim Celeste",
      price: 21000,
      category: "Shorts",
      badge: "new",
      description: "Short de jean tiro bajo, corte corto.",
      images: [img("short1")],
      stock: 45,
      featured: true,
    },
    {
      code: "TOP-001",
      name: "Campera Denim Oversize",
      price: 42000,
      category: "Partes de arriba",
      badge: "",
      description: "Campera de jean oversize, unisex.",
      images: [img("campera1")],
      stock: 25,
      featured: false,
    },
  ]

  for (const item of items) {
    await prisma.catalogoItem.upsert({
      where: { code: item.code },
      update: {},
      create: item,
    })
  }

  console.log("✅ Seed completado: 2 usuarios y 6 productos de catálogo")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
