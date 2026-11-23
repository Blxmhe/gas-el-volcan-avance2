// src/services/usuariosService.js
// Llamadas de usuarios al backend (/api/v1/usuarios). Solo el Administrador puede usarlas.
// Los usuarios se identifican por su RUN sin puntos ni guion (ej: 190110222).

import api from './api'

const RUTA = '/usuarios'

// Arma el cuerpo que espera el backend: los campos opcionales vacíos viajan como null,
// y si la contraseña viene vacía no se envía (el backend mantiene la actual).
function aCuerpo(usuario) {
  const { password, telefono, fechaNacimiento, ...resto } = usuario
  return {
    ...resto,
    telefono: telefono || null,
    fechaNacimiento: fechaNacimiento || null,
    ...(password ? { password } : {}),
  }
}

const UsuariosService = {
  listar() {
    return api.get(RUTA).then((r) => r.data)
  },

  obtener(run) {
    return api.get(`${RUTA}/${encodeURIComponent(run)}`).then((r) => r.data)
  },

  crear(usuario) {
    return api.post(RUTA, aCuerpo(usuario)).then((r) => r.data)
  },

  actualizar(run, usuario) {
    return api.put(`${RUTA}/${encodeURIComponent(run)}`, aCuerpo(usuario)).then((r) => r.data)
  },

  eliminar(run) {
    return api.delete(`${RUTA}/${encodeURIComponent(run)}`)
  },
}

export default UsuariosService
