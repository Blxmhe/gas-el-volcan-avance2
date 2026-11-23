// src/services/pedidosService.js
// Llamadas de pedidos al backend (/api/v1/pedidos).
//   - Crear (desde el carrito): Cliente o Administrador. El backend calcula el total y descuenta el stock.
//   - Listar todos: Administrador y Vendedor.
//   - Mis pedidos: cualquier usuario con sesión.
//   - Cambiar estado y eliminar: solo Administrador.

import api from './api'

const RUTA = '/pedidos'

const PedidosService = {
  // items: [{ codigo, cantidad }, ...] (es el mismo formato que guarda el carrito)
  crear(items) {
    return api.post(RUTA, { items }).then((r) => r.data)
  },

  listar() {
    return api.get(RUTA).then((r) => r.data)
  },

  misPedidos() {
    return api.get(`${RUTA}/mis-pedidos`).then((r) => r.data)
  },

  obtener(id) {
    return api.get(`${RUTA}/${id}`).then((r) => r.data)
  },

  // estado: 'ENTREGADO' o 'CANCELADO' (cancelar devuelve el stock)
  cambiarEstado(id, estado) {
    return api.put(`${RUTA}/${id}/estado`, { estado }).then((r) => r.data)
  },

  eliminar(id) {
    return api.delete(`${RUTA}/${id}`)
  },
}

export default PedidosService
