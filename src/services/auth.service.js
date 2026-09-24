import bcrypt from "bcryptjs"
import prisma from "../config/prisma.js"
import { signToken } from "../utils/jwt.js"

export const registerUser = async ({ name, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    const err = new Error("El email ya está registrado")
    err.status = 409
    throw err
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  })

  const token = signToken({ id: user.id, role: user.role })

  const { password: _pw, ...safeUser } = user
  return { user: safeUser, token }
}

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    const err = new Error("Credenciales inválidas")
    err.status = 401
    throw err
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    const err = new Error("Credenciales inválidas")
    err.status = 401
    throw err
  }

  const token = signToken({ id: user.id, role: user.role })

  const { password: _pw, ...safeUser } = user
  return { user: safeUser, token }
}
