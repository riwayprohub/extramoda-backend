export const errorHandler = (err, req, res, _next) => {
  console.error(err)

  if (err.name === "MulterError") {
    const messages = {
      LIMIT_FILE_SIZE: "El archivo supera el tamaño máximo permitido (10 MB).",
      LIMIT_FILE_COUNT:
        "Demasiadas imágenes: máximo 12 fotos por producto.",
      LIMIT_UNEXPECTED_FILE:
        "Demasiadas imágenes: máximo 12 fotos por producto.",
      LIMIT_PART_COUNT:
        "Demasiados campos en el formulario. Reducí la cantidad de datos.",
    }
    return res.status(400).json({
      success: false,
      message:
        messages[err.code] ||
        "No se pudo subir el archivo. Verificá que sea una imagen válida.",
    })
  }

  if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Registro duplicado: ya existe un valor único en la base de datos.",
      })
    }
  }

  const status = err.status || 500
  return res.status(status).json({
    success: false,
    message: err.message || "Error interno del servidor",
  })
}

export const notFoundHandler = (req, res) => {
  return res.status(404).json({ success: false, message: "Ruta no encontrada" })
}
