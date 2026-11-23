// src/services/api.js
// Cliente HTTP (Axios) que usan TODOS los servicios para hablar con el backend.
// Tiene dos interceptores:
//   1. De petición: agrega el token de acceso en la cabecera Authorization.
//   2. De respuesta: si el backend responde 401 (token vencido), renueva el token con el
//      refresh token y repite la petición original, sin que el usuario se entere.

import axios from 'axios'
import { leerSesion, guardarSesion, borrarSesion } from './sesionStorage'

// La URL del backend se puede cambiar con la variable VITE_API_URL (archivo .env)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const BASE = `${API_URL}/api/v1`

const api = axios.create({ baseURL: BASE })

// 1) Antes de cada petición: agrega "Authorization: Bearer <accessToken>" si hay sesión
api.interceptors.request.use((config) => {
  const sesion = leerSesion()
  if (sesion?.accessToken) {
    config.headers.Authorization = `Bearer ${sesion.accessToken}`
  }
  return config
})

// Si varias peticiones reciben 401 a la vez, todas esperan LA MISMA renovación.
// Cada refresh token se puede usar una sola vez (rotación), así que una segunda
// renovación en paralelo fallaría y cerraría la sesión sin motivo.
let renovacionEnCurso = null

function renovarTokens() {
  if (!renovacionEnCurso) {
    const sesion = leerSesion()
    // Se usa axios "pelado" (no la instancia api) para no pasar por este mismo interceptor
    renovacionEnCurso = axios
      .post(`${BASE}/auth/refresh`, { refreshToken: sesion?.refreshToken })
      .then((respuesta) => {
        guardarSesion(respuesta.data)
        return respuesta.data.accessToken
      })
      .finally(() => {
        renovacionEnCurso = null
      })
  }
  return renovacionEnCurso
}

// 2) Si el backend responde 401, se renueva el token y se repite la petición UNA vez
api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const original = error.config
    const esAuth = original?.url?.includes('/auth/')

    if (error.response?.status === 401 && original && !original._reintento && !esAuth && leerSesion()) {
      original._reintento = true
      try {
        const nuevoToken = await renovarTokens()
        original.headers.Authorization = `Bearer ${nuevoToken}`
        return api(original)
      } catch (errorRenovacion) {
        // El refresh token también venció o fue revocado: se cierra la sesión
        borrarSesion()
        window.dispatchEvent(new Event('sesion-expirada'))
        // Una consulta (GET) puede ser de una ruta pública (catálogo, blogs): el backend rechaza
        // cualquier token inválido, incluso ahí. Como ya no hay sesión, se repite sin token.
        // Si la ruta era protegida, vuelve a fallar y se informa el error de la renovación.
        if (original.method === 'get') {
          delete original.headers.Authorization
          try {
            return await api(original)
          } catch {
            // sigue sin acceso: se informa abajo
          }
        }
        return Promise.reject(errorRenovacion)
      }
    }
    return Promise.reject(error)
  },
)

// Saca un mensaje legible de un error de Axios para mostrárselo al usuario.
// El backend responde errores con { status, error, mensaje, campos }.
export function mensajeDeError(error, porDefecto = 'Ocurrió un error inesperado. Intenta nuevamente.') {
  if (!error?.response) {
    return 'No se pudo conectar con el servidor. Revisa que el backend esté encendido.'
  }
  const datos = error.response.data
  if (datos?.campos && Object.keys(datos.campos).length > 0) {
    return Object.values(datos.campos).join(' ')
  }
  if (datos?.mensaje) return datos.mensaje
  if (error.response.status === 403) return 'No tienes permiso para realizar esta acción.'
  return porDefecto
}

export default api
