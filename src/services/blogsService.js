// src/services/blogsService.js
// Llamadas de blogs al backend (/api/v1/blogs).
// Leer es público; crear, editar y eliminar exigen ser Administrador.

import api from './api'

const RUTA = '/blogs'

// Los campos opcionales vacíos viajan como null
function aCuerpo(blog) {
  return {
    ...blog,
    categoria: blog.categoria?.trim() || null,
    imagen: blog.imagen?.trim() || null,
  }
}

const BlogsService = {
  listar() {
    return api.get(RUTA).then((r) => r.data)
  },

  obtener(id) {
    return api.get(`${RUTA}/${id}`).then((r) => r.data)
  },

  crear(blog) {
    return api.post(RUTA, aCuerpo(blog)).then((r) => r.data)
  },

  actualizar(id, blog) {
    return api.put(`${RUTA}/${id}`, aCuerpo(blog)).then((r) => r.data)
  },

  eliminar(id) {
    return api.delete(`${RUTA}/${id}`)
  },
}

export default BlogsService
