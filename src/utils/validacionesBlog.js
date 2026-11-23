// src/utils/validacionesBlog.js
// Validaciones del formulario de blog (nuevo y editar). Mismos límites que el backend (BlogRequest).
// Devuelve un objeto con un mensaje de error por cada campo inválido; vacío = formulario válido.

export function validarBlog(datos) {
  const errores = {}

  const titulo = String(datos.titulo ?? '').trim()
  const resumen = String(datos.resumen ?? '').trim()
  const contenido = String(datos.contenido ?? '').trim()
  const categoria = String(datos.categoria ?? '').trim()

  if (titulo.length === 0) {
    errores.titulo = 'El título es obligatorio.'
  } else if (titulo.length > 150) {
    errores.titulo = 'El título no puede superar los 150 caracteres.'
  }

  if (resumen.length === 0) {
    errores.resumen = 'El resumen es obligatorio.'
  } else if (resumen.length > 300) {
    errores.resumen = 'El resumen no puede superar los 300 caracteres.'
  }

  if (contenido.length === 0) {
    errores.contenido = 'El contenido es obligatorio.'
  } else if (contenido.length > 5000) {
    errores.contenido = 'El contenido no puede superar los 5000 caracteres.'
  }

  // La categoría es opcional, pero con máximo
  if (categoria.length > 50) {
    errores.categoria = 'La categoría no puede superar los 50 caracteres.'
  }

  return errores
}
