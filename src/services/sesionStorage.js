// src/services/sesionStorage.js
// Guarda la sesión (tokens y datos del usuario) en localStorage para que sobreviva
// a la recarga de la página. Es el único archivo que toca la clave 'sesion'.
//
// La sesión guardada tiene la forma de la respuesta del login del backend:
// { accessToken, refreshToken, correo, nombre, tipoUsuario }

const CLAVE = 'sesion'

export function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE))
  } catch {
    // Si el JSON está dañado o localStorage no está disponible, se trata como "sin sesión"
    return null
  }
}

export function guardarSesion(sesion) {
  localStorage.setItem(CLAVE, JSON.stringify(sesion))
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE)
}
