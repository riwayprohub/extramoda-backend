import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../services/orders.service.js"
import { success } from "../utils/apiResponse.js"

export const create = async (req, res, next) => {
  try {
    const order = await createOrder(req.user.id, req.body)
    return success(res, { order }, "Pedido creado", 201)
  } catch (err) {
    next(err)
  }
}

export const mine = async (req, res, next) => {
  try {
    const orders = await getMyOrders(req.user.id)
    return success(res, { orders }, "Mis pedidos")
  } catch (err) {
    next(err)
  }
}

export const all = async (_req, res, next) => {
  try {
    const orders = await getAllOrders()
    return success(res, { orders }, "Todos los pedidos")
  } catch (err) {
    next(err)
  }
}

export const updateStatus = async (req, res, next) => {
  try {
    const order = await updateOrderStatus(req.params.id, req.body)
    return success(res, { order }, "Estado actualizado")
  } catch (err) {
    next(err)
  }
}
