import { verifyToken } from "../utils/jwt.js"
import prisma from "../config/prisma.js"
import { error } from "../utils/apiResponse.js"

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith("Bearer ")) {
      return error(res, "No autorizado - faltan credenciales", 401)
    }

    const token = header.split(" ")[1]
    const payload = verifyToken(token)

    const user = await prisma.user.findUnique({ where: { id: payload.id } })
    if (!user) return error(res, "Usuario no encontrado", 401)

    req.user = user
    next()
  } catch {
    return error(res, "Token inválido o expirado", 401)
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return error(res, "No tienes permisos para esta acción", 403)
    }
    next()
  }
}
