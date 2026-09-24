import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Carpeta pública donde se guardan las imágenes del catálogo
export const uploadsDir = path.join(__dirname, "../../public/uploads")

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Formatos de imagen soportados (todos los comunes + HEIC/HEIF de iPhone + JFIF)
const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".jfif",
  ".png",
  ".webp",
  ".gif",
  ".avif",
  ".heic",
  ".heif",
  ".bmp",
  ".svg",
  ".tiff",
  ".tif",
]

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/bmp",
  "image/svg+xml",
  "image/tiff",
])

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${ext}`)
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ALLOWED_EXTENSIONS.includes(ext) || ALLOWED_MIMES.has(file.mimetype)) {
      return cb(null, true)
    }
    const err = new Error("Formato de imagen no soportado")
    err.status = 400
    return cb(err)
  },
})

// Permite subir varias imágenes a la vez (hasta 12)
const uploadImagesRaw = upload.array("images", 12)

// Si la subida falla a mitad de camino (formato no soportado, archivo grande,
// demasiadas imágenes...), borra los archivos que ya se guardaron en disco
// para no dejar basura en la carpeta de uploads.
export const uploadImages = (req, res, next) => {
  uploadImagesRaw(req, res, (err) => {
    if (err) {
      for (const file of req.files || []) {
        fs.unlink(path.join(uploadsDir, file.filename), () => {})
      }
      return next(err)
    }
    next()
  })
}
