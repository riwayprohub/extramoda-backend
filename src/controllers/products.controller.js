import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getCategories,
} from "../services/catalog.service.js"
import { success } from "../utils/apiResponse.js"

export const list = async (req, res, next) => {
  try {
    const result = await getAllItems(req.query)
    return success(res, result, "Lista de productos")
  } catch (err) {
    next(err)
  }
}

export const show = async (req, res, next) => {
  try {
    const item = await getItemById(req.params.id)
    return success(res, { product: item }, "Detalle del producto")
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const product = await createItem(req.body, req.files || [])
    return success(res, { product }, "Producto creado", 201)
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const product = await updateItem(req.params.id, req.body, req.files || [])
    return success(res, { product }, "Producto actualizado")
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    await deleteItem(req.params.id)
    return success(res, null, "Producto eliminado")
  } catch (err) {
    next(err)
  }
}

export const categories = async (_req, res, next) => {
  try {
    const result = await getCategories()
    return success(res, { categories: result }, "Categorías")
  } catch (err) {
    next(err)
  }
}
