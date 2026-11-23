// src/services/productosService.js
// Llamadas de productos al backend (/api/v1/productos).
// Leer es público; crear, editar y eliminar exigen ser Administrador.
// Los productos se identifican por su código (ej: CL002).

import api from './api'

const RUTA = '/productos'

const ProductosService = {
  listar() {
    return api.get(RUTA).then((r) => r.data)
  },

  obtener(codigo) {
    return api.get(`${RUTA}/${encodeURIComponent(codigo)}`).then((r) => r.data)
  },

  crear(producto) {
    return api.post(RUTA, producto).then((r) => r.data)
  },

  actualizar(codigo, producto) {
    return api.put(`${RUTA}/${encodeURIComponent(codigo)}`, producto).then((r) => r.data)
  },

  eliminar(codigo) {
    return api.delete(`${RUTA}/${encodeURIComponent(codigo)}`)
  },
}

export default ProductosService
