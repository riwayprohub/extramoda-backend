export const success = (res, data, message = "OK", status = 200) => {
  return res.status(status).json({ success: true, message, data })
}

export const error = (res, message = "Error", status = 400) => {
  return res.status(status).json({ success: false, message })
}

export const notFound = (res, message = "Recurso no encontrado") => {
  return res.status(404).json({ success: false, message })
}
