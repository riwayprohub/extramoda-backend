import { registerUser, loginUser } from "../services/auth.service.js"
import { success, error } from "../utils/apiResponse.js"

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body)
    return success(res, result, "Registro exitoso", 201)
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body)
    return success(res, result, "Inicio de sesión exitoso")
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req, res) => {
  return success(res, { user: req.user }, "Datos del usuario")
}
