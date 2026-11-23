// src/services/authService.js
// Llamadas de autenticación al backend (rutas públicas /api/v1/auth/*).

import api from './api'

const AuthService = {
  // Devuelve { accessToken, refreshToken, correo, nombre, tipoUsuario }
  login(correo, password) {
    return api.post('/auth/login', { correo, password })
  },

  // Registro de un cliente nuevo. El backend siempre lo crea con tipo "Cliente".
  registrar(datos) {
    return api.post('/auth/register', datos)
  },

  // Revoca el refresh token en el servidor (cierre de sesión real)
  logout(refreshToken) {
    return api.post('/auth/logout', { refreshToken })
  },
}

export default AuthService
